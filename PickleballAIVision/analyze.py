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
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()
    mp_drawing = mp.solutions.drawing_utils

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

            landmarks = results.pose_landmarks.landmark
            left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
            right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]

            x = int((left_ankle.x + right_ankle.x) / 2 * w)
            y = int((left_ankle.y + right_ankle.y) / 2 * h)

            cv2.circle(frame, (x, y + 15), 20, (0, 255, 0), 4)

        out.write(frame)
        frame_count += 1

    cap.release()
    out.release()
    pose.close()

    return {
        "frame_count": frame_count
    }
