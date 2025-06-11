import os
import cv2
import json
import numpy as np
import mediapipe as mp
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Khởi tạo MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Hàm phân tích tư thế từ video
def analyze_pose(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None
    
    feedbacks = []
    timestamps = []
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)
    duration_ms = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        timestamp_ms = int((frame_count / fps) * 1000)
        timestamps.append(timestamp_ms)

        # Chuyển đổi sang RGB và phát hiện tư thế
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        if results.pose_landmarks and results.pose_landmarks.landmark:
            landmarks = results.pose_landmarks.landmark
            left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
            left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
            if left_elbow.y > left_shoulder.y + 0.1:
                feedbacks.append({"feedback": "Duỗi thẳng khuỷu tay", "timestamp": timestamp_ms})
            elif left_hip.y > left_shoulder.y + 0.2:
                feedbacks.append({"feedback": "Cần cải thiện độ cao cú đánh", "timestamp": timestamp_ms})
            else:
                feedbacks.append({"feedback": "Tư thế tốt", "timestamp": timestamp_ms})
            if frame_count % 10 == 0:
                feedbacks.append({"feedback": "Sức mạnh cần tăng", "timestamp": timestamp_ms})
        else:
            feedbacks.append({"feedback": "Không phát hiện tư thế", "timestamp": timestamp_ms})

    cap.release()
    os.remove(video_path)

    # Đánh giá cấp độ kỹ năng
    if len(feedbacks) < 2:
        skill_levels = ["rất yếu", "yếu"]
    else:
        idx = min(len(feedbacks) // 2, 2)
        skill_levels = ["yếu", "khá", "tốt"][idx]
    user_level = "Beginner" if len(feedbacks) < 2 else "Intermediate" if len(feedbacks) < 4 else "Advanced"

    # Tạo phản hồi poseData
    pose_data = {
        "feedbacks": feedbacks[:4],  # Giới hạn 4 feedback
        "skillLevels": skill_levels,
        "userLevel": user_level
    }
    return {
        "poseData": json.dumps(pose_data),
        "analysisResult": json.dumps({"summary": f"Phân tích dựa trên {len(feedbacks)} cú đánh"})
    }

# Endpoint xử lý video
@app.route('/pose-estimation', methods=['POST'])
def analyze_video_endpoint():
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file uploaded"}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        video_path = "temp_video.mp4"
        video_file.save(video_path)
        
        result = analyze_pose(video_path)
        if result is None:
            return jsonify({"error": "Failed to process video"}), 500
        
        learner_id = request.form.get('learnerId', '6049cd4a-a647-402e-bbaf-f0fa6a53f068')
        created_at = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000+07:00')
        
        response = {
            "videoId": "550e8400-e29b-41d4-a716-446655440000",
            "learnerId": learner_id,
            "poseData": result["poseData"],
            "analysisResult": result["analysisResult"],
            "createdAt": created_at
        }
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)