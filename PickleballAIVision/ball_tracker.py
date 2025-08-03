
import cv2
import numpy as np
from config import (
    BALL_LOWER, BALL_UPPER, BALL_MIN_AREA, BALL_MAX_AREA, BALL_CIRCULARITY,
    COLOR_BALL, TRAIL_LIFESPAN
)

class BallTracker:
    def __init__(self):
        self.ball_positions = []

    def detect_ball(self, frame, frame_idx):
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, BALL_LOWER, BALL_UPPER)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
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
                return center
        return None

    def draw_ball(self, frame, ball_center):
        if ball_center:
            cv2.circle(frame, ball_center, 10, COLOR_BALL, -1)

    def update_trail(self, ball_center, frame_idx):
        if ball_center:
            if not self.ball_positions or self.ball_positions[-1]["pos"] != ball_center:
                self.ball_positions.append({"pos": ball_center, "age": 0})
        for point in self.ball_positions:
            point["age"] += 1
        self.ball_positions = [
            point for point in self.ball_positions if point["age"] < TRAIL_LIFESPAN
        ]

    def draw_ball_trail(self, frame):
        max_age = TRAIL_LIFESPAN
        base_color = (0, 0, 255)  # Đỏ đậm
        base_thickness = 8
        for i in range(1, len(self.ball_positions)):
            p1 = self.ball_positions[i - 1]["pos"]
            p2 = self.ball_positions[i]["pos"]
            age = self.ball_positions[i]["age"]
            alpha = max(0, 1 - age / max_age)
            color = (
                int(base_color[0] * alpha),
                int(base_color[1] * alpha),
                int(base_color[2] * alpha)
            )
            thickness = max(2, int(base_thickness * alpha))
            cv2.line(frame, p1, p2, color, thickness, lineType=cv2.LINE_AA)

    def detect_and_draw_ball(self, frame, overlay, w, h, frame_idx):
        ball_center = self.detect_ball(frame, frame_idx)
        self.draw_ball(overlay, ball_center)
        self.update_trail(ball_center, frame_idx)
        # Vẽ trail lên overlay để không bị blend che mất
        self.draw_ball_trail(overlay)
        return ball_center

