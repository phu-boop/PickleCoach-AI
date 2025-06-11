import os
import cv2
import json
import numpy as np
import mediapipe as mp
from flask import Flask, request, jsonify

app = Flask(__name__)

# Khởi tạo MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Hàm phân loại chuyển động từ video
def classify_movement(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None
    
    labels = []
    timestamps = []
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        timestamp_ms = int((frame_count / fps) * 1000)
        timestamps.append(timestamp_ms)

        # Phát hiện tư thế
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        if results.pose_landmarks and results.pose_landmarks.landmark:
            landmarks = results.pose_landmarks.landmark
            right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
            left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            if right_wrist.x < 0.5 and abs(right_wrist.y - left_wrist.y) < 0.1:
                labels.append({"label": "volley", "timestamp": timestamp_ms})
            elif right_wrist.x > 0.7:
                labels.append({"label": "forehand", "timestamp": timestamp_ms})
            elif left_wrist.x < 0.3 and frame_count % 5 == 0:
                labels.append({"label": "backhand", "timestamp": timestamp_ms})
            elif abs(right_wrist.y - right_shoulder.y) > 0.3 and frame_count % 7 == 0:
                labels.append({"label": "lob", "timestamp": timestamp_ms})
            elif right_wrist.y > 0.7 and frame_count % 6 == 0:
                labels.append({"label": "drop shot", "timestamp": timestamp_ms})
            elif frame_count % 8 == 0:
                labels.append({"label": "serve", "timestamp": timestamp_ms})
            elif frame_count % 9 == 0:
                labels.append({"label": "dink", "timestamp": timestamp_ms})
        else:
            labels.append({"label": "Không xác định", "timestamp": timestamp_ms})

    cap.release()
    os.remove(video_path)

    # Đánh giá cấp độ kỹ năng
    if not labels or len(labels) < 2:
        skill_levels = ["rất yếu", "yếu"]
        movement_skill_levels = ["yếu"]
    else:
        idx = min(len(labels) // 3, 2)
        skill_levels = ["yếu", "khá", "tốt"]
        movement_skill_levels = [skill_levels[idx]]

    # Đề xuất lộ trình mở rộng
    recommendations = [
        {"title": "I. Người mới bắt đầu (Beginner - Trình độ 1.0–2.5)", "description": "Khóa học cơ bản cho người mới", "url": "https://example.com/beginner_course"},
        {"title": "II. Trình độ trung cấp (Intermediate – 3.0–3.5)", "description": "Nâng cao kỹ thuật", "url": "https://example.com/intermediate_course"},
        {"title": "III. Trình độ nâng cao (Advanced – 4.0 trở lên)", "description": "Chuẩn bị thi đấu chuyên nghiệp", "url": "https://example.com/advanced_course"},
        {"title": "Khóa học volley cơ bản", "level": "Beginner", "url": "https://example.com/volley_basic"},
        {"title": "Nâng cao forehand", "level": "Intermediate", "url": "https://example.com/forehand_advanced"},
        {"title": "Kỹ thuật backhand", "level": "Intermediate", "url": "https://example.com/backhand_course"},
        {"title": "Bài tập dink", "level": "Beginner", "url": "https://example.com/dink_exercise"},
        {"title": "Kỹ thuật lob nâng cao", "level": "Advanced", "url": "https://example.com/lob_advanced"},
        {"title": "Hoàn thiện drop shot", "level": "Intermediate", "url": "https://example.com/drop_shot_course"},
        {"title": "Bài tập serve", "level": "Beginner", "url": "https://example.com/serve_exercise"}
    ]

    movement_data = {
        "labels": labels[:4],  # Giới hạn 4 label
        "skillLevels": movement_skill_levels
    }
    return {
        "classifiedMovements": json.dumps(movement_data),
        "recommendations": json.dumps(recommendations)
    }

# Endpoint xử lý phân loại chuyển động
@app.route('/movement-classification', methods=['POST'])
def classify_movement_endpoint():
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file uploaded"}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        video_path = "temp_video.mp4"
        video_file.save(video_path)
        
        result = classify_movement(video_path)
        if result is None:
            return jsonify({"error": "Failed to process video"}), 500
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)