import logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s [%(levelname)s] %(message)s")
logging.getLogger().setLevel(logging.DEBUG)  
import cv2
import mediapipe as mp
import numpy as np
from config import *
from pose_utils import draw_pose_landmarks, draw_ellipse_under_player
from config import SHOT_DEBOUNCE_FRAMES
from ultralytics import YOLO
from ball_tracker import BallTracker
from feedback import detect_shot_type_and_feedback
from PIL import Image, ImageDraw, ImageFont

def process_video(input_path, output_path):
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Log thông tin video ngay sau khi định nghĩa
    logging.info(f"Video resolution: {w}x{h}, FPS: {fps}")

    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
    model = YOLO("yolov8n.pt")
    tracker = BallTracker()

    feedback_good = []
    feedback_errors = []
    detected_shots = []
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

            for g in analysis["feedback"].get("good", []):
                key = (g.get("title", ""), g.get("description", ""))
                if key not in {(x.get("title", ""), x.get("description", "")) for x in feedback_good}:
                    feedback_good.append(g)

            for e in analysis["feedback"].get("bad", []):
                key = (e.get("title", ""), e.get("description", ""))
                if key not in {(x.get("title", ""), x.get("description", "")) for x in feedback_errors}:
                    feedback_errors.append(e)

            WRIST_DISTANCE_THRESHOLD = 300

            new_shots = analysis.get("shot_type", [])
            for shot_data in new_shots:
                shot_type = shot_data["type"]
                wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
                wrist_px = int(wrist.x * w)
                wrist_py = int(wrist.y * h)
                bx, by = ball_center
                wrist_dist = ((bx - wrist_px) ** 2 + (by - wrist_py) ** 2) ** 0.5
                if wrist_dist <= WRIST_DISTANCE_THRESHOLD:
                    if not detected_shots or (frame_idx - last_shot_frame >= SHOT_DEBOUNCE_FRAMES and shot_type != detected_shots[-1]["type"]):
                        shot_data["wrist_distance"] = wrist_dist
                        detected_shots.append(shot_data)
                        last_shot_frame = frame_idx

            # Chuyển overlay sang Pillow một lần trước khi vẽ tất cả văn bản
            overlay_pil = Image.fromarray(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
            draw = ImageDraw.Draw(overlay_pil)

            # Tải font hỗ trợ tiếng Việt
            try:
                font = ImageFont.truetype("arial.ttf", 20)
            except:
                try:
                    font = ImageFont.truetype("roboto.ttf", 20)
                except:
                    logging.warning("Không tìm thấy arial.ttf hoặc roboto.ttf, dùng font mặc định")
                    font = ImageFont.load_default()

            # Biến để theo dõi vị trí y
            y_offset = 10  # Bắt đầu từ 10 pixel từ trên cùng

            # Vẽ lỗi (feedback_errors)
            for item in feedback_errors:
                title = item.get("title", "")
                desc = item.get("description", "")
                text = f"{title}: {desc}"
                try:
                    text = text.encode().decode('utf-8', errors='replace')
                except:
                    logging.error(f"Lỗi mã hóa văn bản lỗi: {text}")
                draw.text((10, y_offset), text, font=font, fill=(255, 0, 0))
                cv2.circle(overlay, (10, y_offset + 10), 8, COLOR_RED, -1)  # Vẽ vòng tròn dưới văn bản
                y_offset += 30  # Tăng 30 pixel cho dòng tiếp theo

            # Vẽ good points (feedback_good)
            for item in feedback_good[:5]:  # Giới hạn 5 phần tử
                text = f"Good: {item.get('title', '')} - {item.get('description', '')}"
                try:
                    text = text.encode().decode('utf-8', errors='replace')
                except:
                    logging.error(f"Lỗi mã hóa văn bản good: {text}")
                draw.text((10, y_offset), text, font=font, fill=(0, 255, 0))
                y_offset += 30  # Tăng 30 pixel cho dòng tiếp theo

            # Vẽ danh sách cú đánh (detected_shots)
            for shot_data in detected_shots[-5:]:  # Lấy 5 cú đánh cuối
                text = f"Hit: {shot_data['type']} ({shot_data['time']}s)"
                try:
                    text = text.encode().decode('utf-8', errors='replace')
                except:
                    logging.error(f"Lỗi mã hóa văn bản cú đánh: {text}")
                draw.text((10, y_offset), text, font=font, fill=(51, 0, 0))
                y_offset += 30  # Tăng 30 pixel cho dòng tiếp theo

            # Chuyển lại sang OpenCV sau khi vẽ xong
            overlay[:] = cv2.cvtColor(np.array(overlay_pil), cv2.COLOR_RGB2BGR)

        # Ball tracking draw
        tracker.detect_and_draw_ball(frame, overlay, w, h, frame_idx)

        # YOLO detection
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