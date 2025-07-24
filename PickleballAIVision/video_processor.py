import cv2
import mediapipe as mp
from config import *
from pose_utils import draw_pose_landmarks, draw_ellipse_under_player
from ultralytics import YOLO
from ball_tracker import BallTracker  

def process_video(input_path, output_path):
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

    model = YOLO("yolov8n.pt")
    tracker = BallTracker(config=__import__("config"))  # Dùng module config

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results_pose = pose.process(image_rgb)
        overlay = frame.copy()

        # Pose detection
        if results_pose.pose_landmarks:
            landmarks = results_pose.pose_landmarks.landmark
            draw_pose_landmarks(overlay, landmarks, BODY_LANDMARKS, BODY_CONNECTIONS, w, h, COLOR_RED, COLOR_WHITE)
            draw_ellipse_under_player(overlay, landmarks, mp_pose, w, h, COLOR_GREEN, MAJOR_AXIS_FACTOR, MINOR_AXIS_FACTOR, ELIPSE_THICKNESS)

        # Bóng + vẽ trail (bằng MediaPipe HSV)
        tracker.detect_and_draw_ball(frame, overlay, w, h)

        # YOLO detection
        results_yolo = model.predict(source=frame, conf=0.3, classes=None, verbose=False)

        for result in results_yolo:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf)
                cls = int(box.cls[0])
                label = model.names[cls]
                if label.lower() in ["sports ball", "ball", "pickleball"]:
                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2
                    center = (center_x, center_y)

                    # Thêm bóng vào tracker
                    tracker.ball_positions.append({'pos': center, 'age': 0})

                    # Shadow
                    shadow_center = (
                        center_x + tracker.cfg.BALL_SHADOW_OFFSET_X,
                        center_y + tracker.cfg.BALL_SHADOW_OFFSET_Y
                    )
                    cv2.ellipse(overlay, shadow_center,
                                (tracker.cfg.BALL_SHADOW_MAJOR, tracker.cfg.BALL_SHADOW_MINOR),
                                0, 0, 360, tracker.cfg.COLOR_SHADOW, 2)

                    # Vẽ khung YOLO
                    cv2.rectangle(overlay, (x1, y1), (x2, y2), COLOR_BALL, 2)
                    cv2.putText(overlay, f"{label} {conf:.2f}", (x1, y1 - 5),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLOR_BALL, 1)
                    break

        # Vẽ đường mờ dần từ YOLO (bổ sung vào)
        max_len = min(len(tracker.ball_positions), tracker.cfg.TRAIL_LENGTH)
        for i in range(1, max_len):
            start_pt = tracker.ball_positions[i - 1]['pos']
            end_pt = tracker.ball_positions[i]['pos']
            age = tracker.ball_positions[i]['age']

            if (0 <= start_pt[0] < w and 0 <= start_pt[1] < h and
                0 <= end_pt[0] < w and 0 <= end_pt[1] < h):

                fade = 1.0 - (age / tracker.cfg.TRAIL_LIFESPAN)
                fade = max(0.0, fade) ** tracker.cfg.FADE_FACTOR

                color = (
                    int(tracker.cfg.COLOR_BALL_TRAIL[0] * fade),
                    int(tracker.cfg.COLOR_BALL_TRAIL[1] * fade),
                    int(tracker.cfg.COLOR_BALL_TRAIL[2] * fade)
                )
                thickness = max(1, int(tracker.cfg.TRAIL_THICKNESS * fade))

                cv2.line(overlay, start_pt, end_pt, color, thickness, lineType=cv2.LINE_AA)

        # Alpha blend
        cv2.addWeighted(overlay, ALPHA, frame, 1 - ALPHA, 0, frame)
        out.write(frame)
        frame_count += 1

    cap.release()
    out.release()
    pose.close()

    return {"frame_count": frame_count}
