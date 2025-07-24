import cv2
import numpy as np

class BallTracker:
    def __init__(self, config):
        self.ball_positions = []  # Mỗi phần tử: {'pos': (x, y), 'age': 0}
        self.cfg = config

    def detect_and_draw_ball(self, frame, overlay, w, h):
        hsv_full = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        ball_mask = cv2.inRange(hsv_full, self.cfg.BALL_LOWER, self.cfg.BALL_UPPER)
        ball_mask = cv2.GaussianBlur(ball_mask, (5, 5), 0)
        contours, _ = cv2.findContours(ball_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        ball_center = None
        for contour in contours:
            area = cv2.contourArea(contour)
            if self.cfg.BALL_MIN_AREA < area < self.cfg.BALL_MAX_AREA:
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                    if circularity > self.cfg.BALL_CIRCULARITY:
                        (x_ball, y_ball), radius = cv2.minEnclosingCircle(contour)
                        center = (int(x_ball), int(y_ball))
                        cv2.circle(overlay, center, int(radius), self.cfg.COLOR_BALL, -1)

                        # Bóng đổ (shadow)
                        shadow_center = (
                            center[0] + self.cfg.BALL_SHADOW_OFFSET_X,
                            center[1] + self.cfg.BALL_SHADOW_OFFSET_Y
                        )
                        cv2.ellipse(overlay, shadow_center,
                                    (self.cfg.BALL_SHADOW_MAJOR, self.cfg.BALL_SHADOW_MINOR),
                                    0, 0, 360, self.cfg.COLOR_SHADOW, 2)

                        # Thêm vào trail với tuổi = 0
                        self.ball_positions.append({'pos': center, 'age': 0})
                        ball_center = center
                        break

        # Kiểm tra và lọc phần tử hợp lệ
        self.ball_positions = [pt for pt in self.ball_positions if isinstance(pt, dict) and 'age' in pt and 'pos' in pt]

        # Tăng tuổi cho các điểm trail
        for pt in self.ball_positions:
            pt['age'] += 1

        # Xoá điểm quá tuổi
        self.ball_positions = [
            pt for pt in self.ball_positions if pt['age'] <= self.cfg.TRAIL_LIFESPAN
        ]

        # Vẽ đường đi mờ dần + nhỏ dần
        for i in range(1, len(self.ball_positions)):
            start = self.ball_positions[i - 1]['pos']
            end = self.ball_positions[i]['pos']
            age = self.ball_positions[i]['age']

            if (0 <= start[0] < w and 0 <= start[1] < h and
                0 <= end[0] < w and 0 <= end[1] < h):

                fade = 1.0 - (age / self.cfg.TRAIL_LIFESPAN)
                fade = max(0.0, fade) ** self.cfg.FADE_FACTOR

                color = (
                    int(self.cfg.COLOR_BALL_TRAIL[0] * fade),
                    int(self.cfg.COLOR_BALL_TRAIL[1] * fade),
                    int(self.cfg.COLOR_BALL_TRAIL[2] * fade)
                )
                thickness = max(1, int(self.cfg.TRAIL_THICKNESS * fade))

                cv2.line(overlay, start, end, color, thickness, lineType=cv2.LINE_AA)

        return ball_center
