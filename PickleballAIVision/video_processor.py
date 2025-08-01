import cv2
import mediapipe as mp
import numpy as np
import config
from config import *
from pose_utils import draw_pose_landmarks, draw_ellipse_under_player
from ultralytics import YOLO
from ball_tracker import BallTracker
from feedback import detect_player_feedback, detect_shot_type_and_feedback

def euclidean_distance(p1, p2):
    return np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def get_wrist_point(landmarks, w, h):
    # Ưu tiên tay phải, fallback tay trái
    wrist = landmarks[16] if landmarks[16].visibility > 0.6 else landmarks[15]
    return (int(wrist.x * w), int(wrist.y * h))

def process_video(input_path, output_path, left_handed):
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
    shots_info = []
    frame_idx = 0
    last_detected_frame = -30

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        overlay = frame.copy()
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results_pose = pose.process(image_rgb)

        ball_center = None

        if results_pose.pose_landmarks:
            landmarks = results_pose.pose_landmarks.landmark
            draw_pose_landmarks(overlay, landmarks, BODY_LANDMARKS, BODY_CONNECTIONS, w, h, COLOR_RED, COLOR_WHITE)
            draw_ellipse_under_player(overlay, landmarks, mp_pose, w, h, COLOR_GREEN, MAJOR_AXIS_FACTOR, MINOR_AXIS_FACTOR, ELIPSE_THICKNESS)

            errors, good_points = detect_player_feedback(landmarks, h, w)
            feedback_good.extend(good_points)
            feedback_errors.extend(msg for (_, _, msg) in errors)
            for (x, y, msg) in errors:
                cv2.putText(overlay, msg, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                cv2.circle(overlay, (x, y), 8, (0, 0, 255), -1)

        ball_center = tracker.detect_and_draw_ball(frame, overlay, w, h, frame_idx)

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
                    ball_center = center
                    break

        if results_pose.pose_landmarks and ball_center:
            wrist_point = get_wrist_point(landmarks, w, h)
            distance = euclidean_distance(ball_center, wrist_point)
            speed = tracker.average_speed(frames=5)

            if distance < 80 and speed > 10 and frame_idx - last_detected_frame > 15:
                current_second = frame_idx / fps
                result = detect_shot_type_and_feedback(landmarks, ball_center, w, h, current_second, left_handed)
                shot_type = result["shot_type"]
                feedback = result["feedback"]

                shots_info.append({
                    "type": shot_type,
                    "time": round(result["time"], 2),
                    "good": feedback["good"],
                    "bad": feedback["bad"]
                })

                cv2.putText(overlay, f"Shot: {shot_type}", (50, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, COLOR_GREEN, 2)
                for idx, good in enumerate(feedback["good"]):
                    cv2.putText(overlay, f"✔ {good}", (50, 80 + idx * 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                for idx, bad in enumerate(feedback["bad"]):
                    cv2.putText(overlay, f"✘ {bad}", (50, 180 + idx * 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

                last_detected_frame = frame_idx

        cv2.addWeighted(overlay, ALPHA, frame, 1 - ALPHA, 0, frame)
        out.write(frame)
        frame_idx += 1

    cap.release()
    out.release()
    pose.close()

    return {
        "frame_count": total_frames,
        "good_points": list(set(feedback_good)),
        "errors": list(set(feedback_errors)),
        "shots": shots_info
    }
