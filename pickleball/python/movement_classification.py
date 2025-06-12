import os
import cv2
import json
import numpy as np
import mediapipe as mp
from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

def classify_movement(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None
    
    labels = []
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        timestamp_ms = int((frame_count / fps) * 1000)

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
            elif left_wrist.x < 0.3:
                labels.append({"label": "backhand", "timestamp": timestamp_ms})
            elif abs(right_wrist.y - right_shoulder.y) > 0.3:
                labels.append({"label": "lob", "timestamp": timestamp_ms})
            elif right_wrist.y > 0.7:
                labels.append({"label": "drop shot", "timestamp": timestamp_ms})
            # Loại bỏ label cố định dựa trên frame_count

    cap.release()
    try:
        os.remove(video_path)
    except Exception:
        pass  # Bỏ qua lỗi xóa file

    skill_level = "yếu" if len(labels) < 2 else "khá" if len(labels) < 4 else "tốt"
    recommendations = [
        {"title": f"Khóa học {skill_level}", "description": f"Nâng cao kỹ thuật {skill_level}", "url": f"https://example.com/{skill_level}_course"}
    ] if labels else [
        {"title": "Khóa học cơ bản", "description": "Dành cho người mới", "url": "https://example.com/beginner_course"}
    ]

    movement_data = {
        "labels": labels[:4],
        "skillLevels": [skill_level]
    }
    return {
        "classifiedMovements": json.dumps(movement_data),
        "recommendations": json.dumps(recommendations)
    }

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