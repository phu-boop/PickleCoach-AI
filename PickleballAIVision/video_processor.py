import cv2
import mediapipe as mp
from config import (
    BODY_LANDMARKS, BODY_CONNECTIONS, COLOR_RED, COLOR_WHITE,
    COLOR_GREEN, COLOR_SHADOW, MAJOR_AXIS_FACTOR, MINOR_AXIS_FACTOR,
    ELIPSE_THICKNESS, SHADOW_OFFSET_X, SHADOW_OFFSET_Y, ALPHA
)

def process_video(input_path, output_path, shadow_detector):
    # Khởi tạo mediapipe
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()

    # Đọc video
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Khởi tạo video output
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        # Tạo overlay cho độ trong suốt
        overlay = frame.copy()

        # Vẽ các hình nếu nhận diện được pose
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Vẽ đường kết nối cơ thể
            for connection in BODY_CONNECTIONS:
                start_idx = connection[0].value
                end_idx = connection[1].value
                start_point = landmarks[start_idx]
                end_point = landmarks[end_idx]
                start_coords = (int(start_point.x * w), int(start_point.y * h))
                end_coords = (int(end_point.x * w), int(end_point.y * h))
                cv2.line(overlay, start_coords, end_coords, COLOR_WHITE, 2)

            # Vẽ chấm đỏ trên các điểm mốc cơ thể
            for landmark in BODY_LANDMARKS:
                point = landmarks[landmark]
                x_point = int(point.x * w)
                y_point = int(point.y * h)
                cv2.circle(overlay, (x_point, y_point), 5, COLOR_RED, -1)

            # Tính trung điểm mắt cá chân và chiều cao cơ thể
            left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
            right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
            left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            x = int((left_ankle.x + right_ankle.x) / 2 * w)
            y = int((left_ankle.y + right_ankle.y) / 2 * h)
            shoulder_y = (left_shoulder.y + right_shoulder.y) / 2 * h
            ankle_y = (left_ankle.y + right_ankle.y) / 2 * h
            body_height = abs(shoulder_y - ankle_y)

            # Tính kích thước elip
            major_axis = int(body_height * MAJOR_AXIS_FACTOR)
            minor_axis = int(body_height * MINOR_AXIS_FACTOR)

            # Vẽ elip chính
            center = (x, y + 15)
            axes = (major_axis, minor_axis)
            cv2.ellipse(overlay, center, axes, 0, 0, 360, COLOR_GREEN, ELIPSE_THICKNESS)

            # Áp dụng độ trong suốt
            cv2.addWeighted(overlay, ALPHA, frame, 1 - ALPHA, 0, frame)

        out.write(frame)
        frame_count += 1

    cap.release()
    out.release()
    pose.close()

    return {"frame_count": frame_count}