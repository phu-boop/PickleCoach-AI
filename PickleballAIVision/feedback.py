import cv2
import numpy as np
import uuid
import math
import os
from config import (
    BALL_LOWER, BALL_UPPER, BALL_MIN_AREA, BALL_MAX_AREA, BALL_CIRCULARITY,
    COLOR_BALL, COLOR_BALL_TRAIL, TRAIL_LENGTH, TRAIL_LIFESPAN, FADE_FACTOR, TRAIL_THICKNESS
)

class BallTracker:
    def __init__(self):
        self.ball_positions = []

    def detect_ball(self, frame, frame_idx):
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, BALL_LOWER, BALL_UPPER)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) == 0:
            print(f"[Frame {frame_idx}] No ball detected.")
            return None

        for cnt in contours:
            area = cv2.contourArea(cnt)
            perimeter = cv2.arcLength(cnt, True)
            if perimeter == 0:
                continue
            circularity = 4 * np.pi * area / (perimeter ** 2)

            if BALL_MIN_AREA < area < BALL_MAX_AREA and circularity > BALL_CIRCULARITY:
                (x, y, w, h) = cv2.boundingRect(cnt)
                center = (int(x + w / 2), int(y + h / 2))
                print(f"[Frame {frame_idx}] Ball detected at {center} (area={area:.1f}, circ={circularity:.2f})")
                return center

        print(f"[Frame {frame_idx}] No valid ball found after filtering.")
        return None

    def draw_ball(self, frame, ball_center):
        if ball_center:
            cv2.circle(frame, ball_center, 10, COLOR_BALL, -1)

    def update_trail(self, ball_center, frame_idx):
        if ball_center:
            self.ball_positions.append({"pos": ball_center, "age": 0})
            print(f"[Frame {frame_idx}] Ball added to trail: {ball_center}")

        for point in self.ball_positions:
            point["age"] += 1

        self.ball_positions = [
            point for point in self.ball_positions if point["age"] < TRAIL_LIFESPAN
        ]
        print(f"[Frame {frame_idx}] Trail length after cleanup: {len(self.ball_positions)}")

    def draw_ball_trail(self, frame):
        for i in range(1, len(self.ball_positions)):
            p1 = self.ball_positions[i - 1]["pos"]
            p2 = self.ball_positions[i]["pos"]
            age = self.ball_positions[i]["age"]

            if p1 is None or p2 is None:
                continue

            opacity = max(0, 255 - int(age * FADE_FACTOR))
            color = (COLOR_BALL_TRAIL[0], COLOR_BALL_TRAIL[1], COLOR_BALL_TRAIL[2], opacity)

            print(f"  >> Drawing line: {p1} -> {p2}, opacity={opacity}")
            overlay = frame.copy()
            cv2.line(overlay, p1, p2, COLOR_BALL_TRAIL, TRAIL_THICKNESS)
            alpha = opacity / 255.0
            frame[:] = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)

def detect_player_feedback(landmarks, height, width):
    feedback_errors = []
    good_points = []

    # Lấy tọa độ vai trái và phải (ví dụ index 11 và 12 theo Mediapipe Pose)
    left_shoulder = landmarks[11]
    right_shoulder = landmarks[12]

    # Đổi tọa độ chuẩn hóa (x ∈ [0,1]) sang pixel
    left_shoulder_x = int(left_shoulder.x * width)
    left_shoulder_y = int(left_shoulder.y * height)

    right_shoulder_x = int(right_shoulder.x * width)
    right_shoulder_y = int(right_shoulder.y * height)

    # Kiểm tra vai có cùng độ cao không (chênh lệch dưới 30px được chấp nhận)
    shoulder_diff = abs(left_shoulder_y - right_shoulder_y)
    if shoulder_diff > 30:
        feedback_errors.append((
            right_shoulder_x,
            right_shoulder_y,
            f"Shoulders not aligned ({shoulder_diff}px)"
        ))
    else:
        good_points.append("shoulder_alignment")

    # Trả về danh sách lỗi và các điểm tốt
    return feedback_errors, good_points
def get_landmark_px(landmarks, idx, width, height):
    lm = landmarks[idx]
    return int(lm.x * width), int(lm.y * height)

def euclidean_distance(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def detect_shot_type_and_feedback(landmarks, ball_pos, width, height, current_second):
    feedback_good = []
    feedback_bad = []

    # Lấy các điểm cơ bản
    left_shoulder = get_landmark_px(landmarks, 11, width, height)
    right_shoulder = get_landmark_px(landmarks, 12, width, height)
    left_elbow = get_landmark_px(landmarks, 13, width, height)
    right_elbow = get_landmark_px(landmarks, 14, width, height)
    left_wrist = get_landmark_px(landmarks, 15, width, height)
    right_wrist = get_landmark_px(landmarks, 16, width, height)
    left_hip = get_landmark_px(landmarks, 23, width, height)
    right_hip = get_landmark_px(landmarks, 24, width, height)
    nose = get_landmark_px(landmarks, 0, width, height)

    avg_shoulder_y = (left_shoulder[1] + right_shoulder[1]) // 2
    avg_hip_y = (left_hip[1] + right_hip[1]) // 2
    avg_elbow_y = (left_elbow[1] + right_elbow[1]) // 2
    avg_wrist_y = (left_wrist[1] + right_wrist[1]) // 2
    mid_hip = ((left_hip[0] + right_hip[0]) // 2, avg_hip_y)

    # 🚫 Nếu bóng nằm quá gần cổ tay ⇒ đang cầm bóng, không phải cú đánh
    dist_to_right_wrist = euclidean_distance(right_wrist, ball_pos)
    if dist_to_right_wrist < 40:  # ngưỡng 40px, bạn có thể điều chỉnh
        return {
            "shot_type": "Holding Ball",
            "feedback": {
                "good": [],
                "bad": ["Player is likely holding the ball – not a shot"]
            },
            "time": round(current_second, 2)
        }

    # ==== Smash ====
    if ball_pos[1] < nose[1]:
        shot_type = "Smash"
        if avg_elbow_y < avg_shoulder_y:
            feedback_good.append("Elbow high for smash")
        else:
            feedback_bad.append("Elbow too low for smash")

        if avg_wrist_y < avg_elbow_y:
            feedback_good.append("Wrist snap executed")
        else:
            feedback_bad.append("Wrist too low – weak smash")

    # ==== Dink ====
    elif abs(ball_pos[1] - avg_hip_y) < 40:
        shot_type = "Dink"
        if avg_wrist_y > avg_elbow_y:
            feedback_good.append("Low wrist – controlled dink")
        else:
            feedback_bad.append("Wrist too high for dink")

        if abs(left_hip[1] - right_hip[1]) < 20:
            feedback_good.append("Balanced stance")
        else:
            feedback_bad.append("Unstable hip position")

    # ==== Drive ====
    elif avg_shoulder_y < ball_pos[1] < avg_hip_y:
        shot_type = "Drive"
        if avg_wrist_y > avg_elbow_y:
            feedback_good.append("Follow-through looks good")
        else:
            feedback_bad.append("Wrist too high – swing not complete")

        shoulder_width = abs(left_shoulder[0] - right_shoulder[0])
        hip_width = abs(left_hip[0] - right_hip[0])
        if shoulder_width < hip_width:
            feedback_good.append("Wide stance – stable")
        else:
            feedback_bad.append("Narrow stance")

    # ==== Volley ====
    elif ball_pos[1] < avg_shoulder_y:
        shot_type = "Volley"
        shoulder_diff = abs(left_shoulder[1] - right_shoulder[1])
        if shoulder_diff < 30:
            feedback_good.append("Shoulders aligned")
        else:
            feedback_bad.append("Shoulders not aligned")

        if avg_elbow_y < avg_shoulder_y:
            feedback_good.append("Elbow above shoulder")
        else:
            feedback_bad.append("Elbow too low")

    # ==== Forehand / Backhand ====
    else:
        # Giả định người thuận tay phải
        body_center_x = (left_shoulder[0] + right_shoulder[0]) // 2

        if ball_pos[0] > body_center_x + 30:
            shot_type = "Forehand"
            feedback_good.append("Forehand swing detected")
            if right_wrist[0] > right_elbow[0]:
                feedback_good.append("Good wrist extension")
            else:
                feedback_bad.append("Wrist not extended")

        elif ball_pos[0] < body_center_x - 30:
            shot_type = "Backhand"
            feedback_good.append("Backhand swing detected")
            if right_wrist[0] < right_elbow[0]:
                feedback_good.append("Good cross-body motion")
            else:
                feedback_bad.append("Wrist not across body")

        else:
            shot_type = "Unknown"
            feedback_bad.append("Unable to classify shot")

    return {
        "shot_type": shot_type,
        "feedback": {
            "good": feedback_good,
            "bad": feedback_bad
        },
        "time": round(current_second, 2)
    }

