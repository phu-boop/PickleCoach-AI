import cv2
import numpy as np
from config import SHADOW_LOWER, SHADOW_UPPER, SHADOW_MIN_AREA

class ShadowDetector:
    def detect_and_draw_shadow(self, frame, overlay, x, y, body_height, w, h):
        # Chuyển frame sang HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        # Lấy vùng ROI gần chân
        shadow_roi_y = int(y - body_height / 8)
        shadow_roi = frame[shadow_roi_y:h, 0:w]
        hsv_roi = hsv[shadow_roi_y:h, 0:w]
        # Áp dụng ngưỡng để phát hiện bóng
        mask = cv2.inRange(hsv_roi, SHADOW_LOWER, SHADOW_UPPER)
        mask = cv2.GaussianBlur(mask, (5, 5), 0)
        # Tìm contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            max_contour = max(contours, key=cv2.contourArea)
            if cv2.contourArea(max_contour) > SHADOW_MIN_AREA:
                cv2.drawContours(overlay[shadow_roi_y:h], [max_contour], -1, (100, 100, 100, 128), 2)