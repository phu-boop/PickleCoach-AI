import cv2
import numpy as np
import math
import mediapipe as mp
from scipy.spatial.distance import euclidean
from flask import Flask, request, jsonify
import logging
import os
import tempfile

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

class EnhancedPickleballAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.previous_landmarks = None
        self.previous_balance_status = None
        self.stroke_sequence = []
        self.court_position_history = []
        
    def calculate_angle(self, point1, point2, point3):
        """Tính góc giữa 3 điểm"""
        a = np.array([point1.x, point1.y])
        b = np.array([point2.x, point2.y])
        c = np.array([point3.x, point3.y])
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / math.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle
    
    def analyze_grip_position(self, landmarks):
        """Phân tích vị trí cầm vợt"""
        right_wrist = landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
        right_elbow = landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        
        grip_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
        
        if grip_angle < 90:
            return "continental_grip", "Cầm vợt kiểu continental - tốt cho volley"
        elif grip_angle < 140:
            return "eastern_grip", "Cầm vợt kiểu eastern - phù hợp forehand"
        else:
            return "western_grip", "Cần điều chỉnh"
    
    def analyze_stance(self, landmarks):
        """Phân tích tư thế đứng"""
        left_foot = landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
        right_foot = landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        
        foot_distance = abs(left_foot.x - right_foot.x)
        shoulder_angle = math.atan2(
            right_shoulder.y - left_shoulder.y,
            right_shoulder.x - left_shoulder.x
        ) * 180 / math.pi
        
        if foot_distance < 0.1:
            return "closed_stance", "Tư thế đóng - cần điều chỉnh"
        elif foot_distance > 0.3:
            return "open_stance", "Tư thế mở - tốt cho di chuyển"
        else:
            return "neutral_stance", "Tư thế cân bằng"
    
    def analyze_swing_path(self, current_landmarks):
        """Phân tích quỹ đạo swing"""
        if self.previous_landmarks is None:
            self.previous_landmarks = current_landmarks
            return None
            
        curr_wrist = current_landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
        prev_wrist = self.previous_landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
        
        velocity_x = curr_wrist.x - prev_wrist.x
        velocity_y = curr_wrist.y - prev_wrist.y
        velocity = math.sqrt(velocity_x**2 + velocity_y**2)
        
        if velocity_y < -0.02:
            swing_direction = "upward"
            feedback = "Swing từ dưới lên - tốt cho topspin"
        elif velocity_y > 0.02:
            swing_direction = "downward"
            feedback = "Swing từ trên xuống - phù hợp volley"
        else:
            swing_direction = "horizontal"
            feedback = "Swing ngang - cần cải thiện"
            
        self.previous_landmarks = current_landmarks
        
        return {
            "direction": swing_direction,
            "velocity": velocity,
            "feedback": feedback
        }
    
    def detect_shot_type_advanced(self, landmarks):
        """Phân loại cú đánh nâng cao"""
        right_wrist = landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
        right_elbow = landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        left_wrist = landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
        
        elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
        shoulder_rotation = abs(right_shoulder.x - left_shoulder.x)
        wrist_height = right_wrist.y
        wrist_position_diff = right_wrist.x - left_wrist.x
        
        if wrist_position_diff < -0.1 and elbow_angle > 120:
            return "backhand", "Cú backhand - cần kiểm tra lực đánh"
        elif wrist_height < 0.3 and elbow_angle > 140:
            if shoulder_rotation < 0.2:
                return "overhead", "Cú smash/overhead"
            else:
                return "serve", "Cú giao bóng"
        elif wrist_height < 0.5 and elbow_angle < 100:
            if right_wrist.x > 0.6:
                return "volley", "Cú volley"
            else:
                return "half_volley", "Cú half-volley"
        elif wrist_height > 0.6:
            if shoulder_rotation > 0.3:
                return "groundstroke", "Cú đánh từ sân sau"
            else:
                return "drop_shot", "Cú cắt ngắn"
        else:
            return "unknown", "Không xác định được cú đánh"
    
    def analyze_court_position(self, landmarks):
        """Phân tích vị trí trên sân"""
        body_center_x = (landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x + 
                        landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x) / 2
        
        if body_center_x < 0.3:
            position = "baseline"
            advice = "Ở vị trí sân sau - tốt cho groundstroke"
        elif body_center_x > 0.7:
            position = "net"
            advice = "Ở gần lưới - cơ hội cho volley"
        else:
            position = "mid_court"
            advice = "Ở giữa sân - vị trí linh hoạt"
            
        return position, advice
    
    def analyze_balance_stability(self, landmarks):
        """Phân tích sự cân bằng và ổn định"""
        left_ankle = landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
        right_ankle = landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        nose = landmarks[self.mp_pose.PoseLandmark.NOSE.value]
        
        center_of_gravity_x = (left_ankle.x + right_ankle.x) / 2
        balance_offset = abs(nose.x - center_of_gravity_x)
        
        if balance_offset < 0.05:
            return "stable", "Cân bằng tốt"
        elif balance_offset < 0.1:
            return "slightly_unstable", "Hơi mất cân bằng"
        else:
            return "unstable", "Cần cải thiện tư thế cân bằng"
    
    def generate_comprehensive_feedback(self, landmarks, timestamp):
        """Tạo phản hồi toàn diện với balance giảm tần suất"""
        grip_type, grip_feedback = self.analyze_grip_position(landmarks)
        stance_type, stance_feedback = self.analyze_stance(landmarks)
        swing_analysis = self.analyze_swing_path(landmarks)
        shot_type, shot_description = self.detect_shot_type_advanced(landmarks)
        position, position_advice = self.analyze_court_position(landmarks)
        balance_status, balance_feedback = self.analyze_balance_stability(landmarks)
        
        feedback = {
            "timestamp": timestamp,
            "grip": {"type": grip_type, "feedback": grip_feedback},
            "stance": {"type": stance_type, "feedback": stance_feedback},
            "shot": {"type": shot_type, "description": shot_description},
            "position": {"location": position, "advice": position_advice},
            "overall_score": self.calculate_technique_score(landmarks)
        }
        
        if self.previous_balance_status != balance_status:
            feedback["balance"] = {"status": balance_status, "feedback": balance_feedback}
            self.previous_balance_status = balance_status
            
        if swing_analysis:
            feedback["swing"] = swing_analysis
            
        return feedback
    
    def calculate_technique_score(self, landmarks):
        """Tính điểm kỹ thuật tổng thể (0-100)"""
        score = 100
        
        right_wrist = landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
        right_elbow = landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        
        elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
        if elbow_angle < 90 or elbow_angle > 160:
            score -= 20
            
        balance_status, _ = self.analyze_balance_stability(landmarks)
        if balance_status == "unstable":
            score -= 25
        elif balance_status == "slightly_unstable":
            score -= 10
            
        stance_type, _ = self.analyze_stance(landmarks)
        if stance_type == "closed_stance":
            score -= 15
            
        return max(0, score)

def is_pickleball_video(video_path, min_frames_with_action=1):
    """Kiểm tra video có phải là pickleball (có vợt hoặc chuyển động đặc trưng và đủ tư thế)"""
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return False
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    sample_frames = [0, total_frames // 2, total_frames - 1] if total_frames > 0 else [0]
    action_count = 0
    prev_wrist = None
    frame_idx = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx not in sample_frames:
            frame_idx += 1
            continue
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            # Kiểm tra đủ các landmark đặc trưng (cả 2 cổ tay, 2 vai, 2 mắt cá chân)
            required = [
                mp_pose.PoseLandmark.RIGHT_WRIST.value,
                mp_pose.PoseLandmark.LEFT_WRIST.value,
                mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
                mp_pose.PoseLandmark.LEFT_SHOULDER.value,
                mp_pose.PoseLandmark.RIGHT_ANKLE.value,
                mp_pose.PoseLandmark.LEFT_ANKLE.value
            ]
            if not all(0 <= idx < len(landmarks) and landmarks[idx].visibility > 0.5 for idx in required):
                frame_idx += 1
                continue
            right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
            # Kiểm tra chuyển động vung vợt (wrist di chuyển nhanh)
            if prev_wrist is not None:
                dx = right_wrist.x - prev_wrist.x
                dy = right_wrist.y - prev_wrist.y
                velocity = math.sqrt(dx**2 + dy**2)
                # Chỉ tính nếu chuyển động đủ lớn và có đủ tư thế
                if velocity > 0.07:
                    action_count += 1
            prev_wrist = right_wrist
        frame_idx += 1
    cap.release()
    return action_count >= min_frames_with_action

def enhanced_analyze_video(video_path):
    """Hàm phân tích video cải tiến, giới hạn 3 phản hồi"""
    # Kiểm tra video có phải pickleball không
    if not is_pickleball_video(video_path):
        return {"error": "Không phát hiện hoạt động pickleball (vợt/bóng) trong video. Vui lòng tải lên video phù hợp."}
    analyzer = EnhancedPickleballAnalyzer()
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        return None
        
    comprehensive_feedbacks = []
    frame_count = 0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    
    target_frames = [0, total_frames // 2, total_frames - 1] if total_frames > 0 else [0]
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_count += 1
        timestamp_ms = int((frame_count / fps) * 1000)
        
        if frame_count - 1 not in target_frames:
            continue
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = analyzer.pose.process(rgb_frame)
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            feedback = analyzer.generate_comprehensive_feedback(landmarks, timestamp_ms)
            comprehensive_feedbacks.append(feedback)
    
    cap.release()
    
    if comprehensive_feedbacks:
        avg_score = sum(f["overall_score"] for f in comprehensive_feedbacks) / len(comprehensive_feedbacks)
        skill_level = "Advanced" if avg_score >= 80 else "Intermediate" if avg_score >= 60 else "Beginner"
        
        technique_analysis = {
            "grip_consistency": len([f for f in comprehensive_feedbacks if f["grip"]["type"] == "eastern_grip"]),
            "stance_quality": len([f for f in comprehensive_feedbacks if f["stance"]["type"] == "neutral_stance"]),
            "grip_issues": len([f for f in comprehensive_feedbacks if f["grip"]["type"] != "eastern_grip"]),
            "balance_issues": len([f for f in comprehensive_feedbacks if "balance" in f and f["balance"]["status"] != "stable"])
        }
        
        shot_scores = {}
        for feedback in comprehensive_feedbacks:
            shot_type = feedback["shot"]["type"]
            if shot_type != "unknown":
                if shot_type not in shot_scores:
                    shot_scores[shot_type] = []
                shot_scores[shot_type].append(feedback["overall_score"])
        
        weakest_shots = []
        for shot_type, scores in shot_scores.items():
            avg_shot_score = sum(scores) / len(scores)
            if avg_shot_score < 80:
                weakest_shots.append(shot_type)
        
        if not weakest_shots and any(f["grip"]["type"] == "western_grip" for f in comprehensive_feedbacks):
            weakest_shots.append("backhand")
        
        shot_analysis = {
            "shots_detected": list(set(f["shot"]["type"] for f in comprehensive_feedbacks)),
            "weakest_shots": weakest_shots
        }
        performance_metrics = {
            "averageScore": avg_score,
            "totalFrames": len(comprehensive_feedbacks)
        }
        
        return {
            "detailed_feedbacks": comprehensive_feedbacks,
            "techniqueAnalysis": technique_analysis,
            "shotAnalysis": shot_analysis,
            "performanceMetrics": performance_metrics,
            "average_score": avg_score,
            "skill_level": skill_level,
            "total_analyzed_frames": len(comprehensive_feedbacks)
        }
    
    return None

@app.route('/video-analysis-enhanced', methods=['POST'])
def enhanced_analysis():
    temp_path = None
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        video = request.files['video']
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp:
            video.save(temp.name)
            temp_path = temp.name
        result = enhanced_analyze_video(temp_path)
        if result is None:
            return jsonify({"error": "Không thể phân tích video"}), 400
        if isinstance(result, dict) and result.get("error"):
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        logging.exception("Error in enhanced_analysis")
        return jsonify({"error": str(e)}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception as ex:
                logging.warning(f"Could not delete temp file: {temp_path} - {ex}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)