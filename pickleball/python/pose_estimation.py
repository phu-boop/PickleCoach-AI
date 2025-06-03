from flask import Flask, request, jsonify
import cv2
import mediapipe as mp

app = Flask(__name__)
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

@app.route('/pose-estimation', methods=['POST'])
def pose_estimation():
   video_path = request.data.decode('utf-8')
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
   pose.close()
   return jsonify({"feedback": feedback})

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000)

