import logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s [%(levelname)s] %(message)s")
logging.getLogger().setLevel(logging.DEBUG)  
import cv2
import mediapipe as mp
import numpy as np
from config import *
from pose_utils import draw_pose_landmarks, draw_ellipse_under_player
from config import SHOT_DEBOUNCE_FRAMES  # Import hằng số
from ultralytics import YOLO
from ball_tracker import BallTracker
from feedback import detect_shot_type_and_feedback

def process_video(input_path, output_path):
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
    model = YOLO("yolov8n.pt")
    tracker = BallTracker()

    feedback_good = []
    feedback_errors = []
    detected_shots = []  # Lưu danh sách {type: str, time: float}
    last_shot_frame = 0
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        overlay = frame.copy()
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results_pose = pose.process(image_rgb)

        if results_pose.pose_landmarks:
            landmarks = results_pose.pose_landmarks.landmark
            draw_pose_landmarks(overlay, landmarks, BODY_LANDMARKS, BODY_CONNECTIONS, w, h, COLOR_RED, COLOR_WHITE)
            draw_ellipse_under_player(overlay, landmarks, mp_pose, w, h, COLOR_GREEN, MAJOR_AXIS_FACTOR, MINOR_AXIS_FACTOR, ELIPSE_THICKNESS)

            ball_center = tracker.detect_ball(frame, frame_idx) or (w // 2, h // 2)
            analysis = detect_shot_type_and_feedback(landmarks, ball_center, w, h, frame_idx / fps, False, last_shot_frame)

            # analysis["feedback"]["good"] and ["bad"] are lists of dicts now
            for g in analysis["feedback"].get("good", []):
                # tránh duplicate: chỉ thêm nếu chưa thấy giống title+desc
                key = (g.get("title",""), g.get("description",""))
                if key not in {(x.get("title",""), x.get("description","")) for x in feedback_good}:
                    feedback_good.append(g)

            for e in analysis["feedback"].get("bad", []):
                key = (e.get("title",""), e.get("description",""))
                if key not in {(x.get("title",""), x.get("description","")) for x in feedback_errors}:
                    feedback_errors.append(e)

            WRIST_DISTANCE_THRESHOLD = 300  # pixel

            new_shots = analysis.get("shot_type", [])
            for shot_data in new_shots:
                shot_type = shot_data["type"]

                # Lấy vị trí cổ tay phải (có thể đổi sang LEFT_WRIST nếu cần)
                wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
                wrist_px = int(wrist.x * w)
                wrist_py = int(wrist.y * h)

                # Tính khoảng cách bóng - cổ tay
                bx, by = ball_center
                wrist_dist = ((bx - wrist_px) ** 2 + (by - wrist_py) ** 2) ** 0.5
                if ball_center and wrist_px is not None and wrist_py is not None:
                    bx, by = ball_center
                    wrist_dist = ((bx - wrist_px) ** 2 + (by - wrist_py) ** 2) ** 0.5

                    # In log chuẩn
                    logging.debug(f"Khoảng cách bóng – cổ tay: {wrist_dist:.2f} px")

                    # In trực tiếp ra console để chắc chắn thấy
                    print(f"[DEBUG] Khoảng cách bóng – cổ tay: {wrist_dist:.2f} px")
                # Chỉ ghi nhận nếu bóng đủ gần cổ tay
                if wrist_dist <= WRIST_DISTANCE_THRESHOLD:
                    if not detected_shots or (
                        frame_idx - last_shot_frame >= SHOT_DEBOUNCE_FRAMES and 
                        shot_type != detected_shots[-1]["type"]
                    ):
                        shot_data["wrist_distance"] = wrist_dist  # lưu thêm thông tin khoảng cách
                        detected_shots.append(shot_data)
                        last_shot_frame = frame_idx


            # Vẽ lỗi lên overlay
            for item in feedback_errors:
                title = item.get("title", "")
                desc = item.get("description", "")
                pos = item.get("position")
                text = f"{title}: {desc}"
                if pos:
                    x, y = pos["x"], pos["y"]
                    cv2.putText(overlay, text, (x, max(20, y - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLOR_RED, 2)
                    cv2.circle(overlay, (x, y), 8, COLOR_RED, -1)
                else:
                    # vẽ ở bên trên góc phải nếu không có vị trí cụ thể
                    cv2.putText(overlay, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, COLOR_RED, 2)

            # Vẽ good points (màu xanh)
            for i, item in enumerate(feedback_good[:5]):  # giới hạn hiển thị
                text = f"Good: {item.get('title','')} - {item.get('description','')}"
                cv2.putText(overlay, text, (10, 60 + i * 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLOR_GREEN, 2)

            # Vẽ detected shots summary
            for i, shot_data in enumerate(detected_shots[-5:]):  # chỉ hiển thị 5 cuối
                cv2.putText(overlay, f"Hit: {shot_data['type']} ({shot_data['time']}s)", 
                          (w - 350, 30 + i * 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (51, 0, 0), 2)

        # Ball tracking draw (giữ nguyên)
        tracker.detect_and_draw_ball(frame, overlay, w, h, frame_idx)

        # YOLO detection (giữ như cũ)
        results_yolo = model.predict(source=frame, conf=0.3, classes=None, verbose=False)
        for result in results_yolo:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf)
                cls = int(box.cls[0])
                label = model.names[cls]
                if label.lower() in ["sports ball", "ball", "pickleball"]:
                    center = ((x1 + x2) // 2, (y1 + y2) // 2)
                    if not tracker.ball_positions or tracker.ball_positions[-1]['pos'] != center:
                        tracker.ball_positions.append({'pos': center, 'age': 0})
                    cv2.rectangle(overlay, (x1, y1), (x2, y2), COLOR_BALL, 2)
                    cv2.putText(overlay, f"{label} {conf:.2f}", (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLOR_BALL, 1)
                    break

        cv2.addWeighted(overlay, ALPHA, frame, 1 - ALPHA, 0, frame)
        out.write(frame)
        frame_idx += 1

    cap.release()
    out.release()
    pose.close()

    detected_shot = detected_shots[-1] if detected_shots else None

    return {
        "frame_count": total_frames,
        "good_points": feedback_good,
        "errors": feedback_errors,
        "detected_shots": detected_shots,
        "detected_shot": detected_shot
    }
