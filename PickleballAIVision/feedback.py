import cv2
import numpy as np
import uuid
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
