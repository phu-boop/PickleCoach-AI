from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Initialize TensorFlow Lite for movement classification
interpreter = tf.lite.Interpreter(model_path="D:\\LTJAVA\\Project\\PickleCoach-AI\\pickleball\\python\\movement_classifier.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
labels = ["forehand", "backhand", "serve"]  # Adjust based on your training labels

@app.route('/pose-estimation', methods=['POST'])
def pose_estimation():
    data = request.get_json()  # Expect JSON with video_path
    video_path = data.get('video_path')
    if not video_path:
        return jsonify({"error": "No video_path provided"}), 400

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return jsonify({"error": "Cannot open video"}), 400

    feedback = "Hạ thấp trọng tâm"
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            elbow_y = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW].y
            shoulder_y = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y
            if elbow_y > shoulder_y + 0.1:
                feedback = "Duỗi thẳng khuỷu tay"
            break

    cap.release()
    return jsonify({"feedback": feedback})

@app.route('/movement-classification', methods=['POST'])
def movement_classification():
    data = request.get_json()
    video_path = data.get('video_path')
    print(f"Received video_path: {video_path}")
    if not video_path:
        return jsonify({"error": "No video_path provided"}), 400

    cap = cv2.VideoCapture(video_path)
    keypoints_list = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        if results.pose_landmarks:
            keypoints = []
            for landmark in results.pose_landmarks.landmark:
                keypoints.extend([landmark.x, landmark.y, landmark.z])
            keypoints_list.append(keypoints)
    cap.release()

    if not keypoints_list:
        print("No keypoints detected")
        return jsonify({"error": "Cannot process video"})

    print(f"Keypoints shape: {np.array(keypoints_list).shape}")
    keypoints_array = np.array(keypoints_list, dtype=np.float32)
    keypoints_array = keypoints_array.mean(axis=0).reshape(1, -1)
    interpreter.set_tensor(input_details[0]['index'], keypoints_array)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    predicted_label = labels[np.argmax(output_data[0])]
    print(f"Predicted label: {predicted_label}")
    return jsonify({"label": predicted_label})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)