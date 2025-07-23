import cv2
import mediapipe as mp
import subprocess
import os

def convert_to_browser_compatible(input_path, output_path):
    ffmpeg_path = "C:/Users/phudz/Downloads/ffmpeg-7.1.1-essentials_build/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe"

    if not os.path.exists(ffmpeg_path):
        raise FileNotFoundError("FFmpeg không tìm thấy. Kiểm tra lại đường dẫn.")

    subprocess.run([
        ffmpeg_path, "-y",
        "-i", input_path,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-strict", "experimental",
        output_path
    ], check=True)

def analyze_video(input_path, output_path):
    # Khởi tạo mediapipe để nhận diện các điểm trên cơ thể
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()
    mp_drawing = mp.solutions.drawing_utils

    # Đọc video
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Khởi tạo video output
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    # Tùy chỉnh POSE_CONNECTIONS để loại bỏ các kết nối liên quan đến mặt
    body_connections = [
        (mp_pose.PoseLandmark.LEFT_SHOULDER, mp_pose.PoseLandmark.RIGHT_SHOULDER),
        (mp_pose.PoseLandmark.LEFT_SHOULDER, mp_pose.PoseLandmark.LEFT_ELBOW),
        (mp_pose.PoseLandmark.RIGHT_SHOULDER, mp_pose.PoseLandmark.RIGHT_ELBOW),
        (mp_pose.PoseLandmark.LEFT_ELBOW, mp_pose.PoseLandmark.LEFT_WRIST),
        (mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST),
        (mp_pose.PoseLandmark.LEFT_SHOULDER, mp_pose.PoseLandmark.LEFT_HIP),
        (mp_pose.PoseLandmark.RIGHT_SHOULDER, mp_pose.PoseLandmark.RIGHT_HIP),
        (mp_pose.PoseLandmark.LEFT_HIP, mp_pose.PoseLandmark.RIGHT_HIP),
        (mp_pose.PoseLandmark.LEFT_HIP, mp_pose.PoseLandmark.LEFT_KNEE),
        (mp_pose.PoseLandmark.RIGHT_HIP, mp_pose.PoseLandmark.RIGHT_KNEE),
        (mp_pose.PoseLandmark.LEFT_KNEE, mp_pose.PoseLandmark.LEFT_ANKLE),
        (mp_pose.PoseLandmark.RIGHT_KNEE, mp_pose.PoseLandmark.RIGHT_ANKLE),
    ]

    # Danh sách các điểm mốc cơ thể (loại bỏ các điểm trên mặt)
    body_landmarks = [
        mp_pose.PoseLandmark.LEFT_SHOULDER,
        mp_pose.PoseLandmark.RIGHT_SHOULDER,
        mp_pose.PoseLandmark.LEFT_ELBOW,
        mp_pose.PoseLandmark.RIGHT_ELBOW,
        mp_pose.PoseLandmark.LEFT_WRIST,
        mp_pose.PoseLandmark.RIGHT_WRIST,
        mp_pose.PoseLandmark.LEFT_HIP,
        mp_pose.PoseLandmark.RIGHT_HIP,
        mp_pose.PoseLandmark.LEFT_KNEE,
        mp_pose.PoseLandmark.RIGHT_KNEE,
        mp_pose.PoseLandmark.LEFT_ANKLE,
        mp_pose.PoseLandmark.RIGHT_ANKLE
    ]

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        # Tạo overlay để vẽ các hình với độ trong suốt
        overlay = frame.copy()

        # Vẽ các đường kết nối, chấm đỏ và elip trên cơ thể
        if results.pose_landmarks:
            # Vẽ các đường kết nối cơ thể
            for connection in body_connections:
                start_idx = connection[0].value
                end_idx = connection[1].value
                start_point = results.pose_landmarks.landmark[start_idx]
                end_point = results.pose_landmarks.landmark[end_idx]
                start_coords = (int(start_point.x * w), int(start_point.y * h))
                end_coords = (int(end_point.x * w), int(end_point.y * h))
                cv2.line(overlay, start_coords, end_coords, (255, 255, 255), 2)

            # Vẽ các chấm đỏ trên các điểm mốc cơ thể
            for landmark in body_landmarks:
                point = results.pose_landmarks.landmark[landmark]
                x_point = int(point.x * w)
                y_point = int(point.y * h)
                cv2.circle(overlay, (x_point, y_point), 5, (0, 0, 255), -1)  # Chấm đỏ, bán kính 5

            landmarks = results.pose_landmarks.landmark
            left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
            right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
            left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

            # Tính trung điểm của hai mắt cá chân
            x = int((left_ankle.x + right_ankle.x) / 2 * w)
            y = int((left_ankle.y + right_ankle.y) / 2 * h)

            # Ước lượng chiều cao cơ thể
            shoulder_y = (left_shoulder.y + right_shoulder.y) / 2 * h
            ankle_y = (left_ankle.y + right_ankle.y) / 2 * h
            body_height = abs(shoulder_y - ankle_y)

            # Tính kích thước elip dựa trên chiều cao cơ thể, làm tròn hơn
            major_axis = int(body_height / 2)  # Độ rộng elip bằng 1/2 chiều cao
            minor_axis = int(body_height / 4)  # Độ dẹt elip bằng 1/4 chiều cao (tròn hơn)

            # Vẽ hình elip
            center = (x, y + 15)
            axes = (major_axis, minor_axis)
            angle = 0
            start_angle = 0
            end_angle = 360
            color = (0, 255, 0, 128)  # Xanh lá với alpha 128
            thickness = 4

            cv2.ellipse(overlay, center, axes, angle, start_angle, end_angle, color, thickness)

            # Áp dụng độ trong suốt cho toàn bộ overlay
            cv2.addWeighted(overlay, 0.5, frame, 0.5, 0, frame)

        out.write(frame)
        frame_count += 1

    cap.release()
    out.release()
    pose.close()

    return {
        "frame_count": frame_count
    }