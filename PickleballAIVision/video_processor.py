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
    fps = cap.get(cv2.CAP_PROP_FPS)
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
            result = detect_shot_type_and_feedback(landmarks, ball_center, w, h, frame_idx / fps, False, last_shot_frame)
            feedback_good.extend(result["feedback"]["good"])
            feedback_errors.extend(result["feedback"]["bad"])
            new_shots = result["shot_type"]

            for shot_data in new_shots:
                shot_type = shot_data["type"]
                if not detected_shots or (frame_idx - last_shot_frame >= SHOT_DEBOUNCE_FRAMES and 
                                         shot_type != [s["type"] for s in detected_shots[-1:]][0]):
                    detected_shots.append(shot_data)
                    last_shot_frame = frame_idx

            for item in feedback_errors:
                if isinstance(item, (tuple, list)) and len(item) == 3:
                    x, y, msg = item
                    cv2.putText(overlay, msg, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    cv2.circle(overlay, (x, y), 8, (0, 0, 255), -1)
                else:
                    print(f"[Warning] Invalid error format: {item}")

            for i, shot_data in enumerate(detected_shots):
                if i == 0 or shot_data["type"] != detected_shots[i - 1]["type"]:
                    cv2.putText(overlay, f"Hit: {shot_data['type']} ({shot_data['time']}s)", 
                              (10, 30 + i * 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (51, 0, 0), 2)

        tracker.detect_and_draw_ball(frame, overlay, w, h, frame_idx)

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
        "detected_shots": detected_shots,  # Danh sách {type, time}
        "detected_shot": detected_shot
    }