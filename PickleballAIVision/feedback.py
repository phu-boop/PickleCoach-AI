import cv2
import numpy as np
from typing import List, Tuple, Optional, Dict
from ball_tracker import BallTracker
from config import SHOT_DEBOUNCE_FRAMES, DISTANCE_THRESHOLD

COLOR_RED = (0, 0, 255)
COLOR_GREEN = (0, 255, 0)

def detect_shot_type_and_feedback(
    landmarks: List,
    ball_pos: Optional[Tuple[int, int]],
    width: int,
    height: int,
    current_second: float,
    left_handed: bool,
    last_shot_frame: int = 0
) -> Dict:
    feedback_good = []
    feedback_bad = []
    detected_shots = []

    if len(landmarks) < 17:
        return {
            "shot_type": [],
            "feedback": {"good": [], "bad": ["Dữ liệu landmarks không đủ"]},
            "time": round(current_second, 2)
        }

    # Các vị trí cơ thể
    left_shoulder = (int(landmarks[11].x * width), int(landmarks[11].y * height))
    right_shoulder = (int(landmarks[12].x * width), int(landmarks[12].y * height))
    left_elbow = (int(landmarks[13].x * width), int(landmarks[13].y * height))
    right_elbow = (int(landmarks[14].x * width), int(landmarks[14].y * height))
    left_wrist = (int(landmarks[15].x * width), int(landmarks[15].y * height))
    right_wrist = (int(landmarks[16].x * width), int(landmarks[16].y * height))
    nose = (int(landmarks[0].x * width), int(landmarks[0].y * height))
    body_center_x = (left_shoulder[0] + right_shoulder[0]) // 2
    avg_shoulder_y = (left_shoulder[1] + right_shoulder[1]) // 2

    wrist = left_wrist if left_handed else right_wrist
    elbow = left_elbow if left_handed else right_elbow
    shoulder = left_shoulder if left_handed else right_shoulder

    if ball_pos is None or ball_pos == (0, 0):
        # Không xác định được bóng
        feedback_bad.append("Không nhận diện được bóng – không xác định cú đánh")
        return {
            "shot_type": [],
            "feedback": {"good": feedback_good, "bad": feedback_bad},
            "time": round(current_second, 2)
        }

    # Nếu bóng hợp lệ thì mới tính distance
    ball_distance = np.linalg.norm(np.array(ball_pos) - np.array(wrist))

    if ball_distance < DISTANCE_THRESHOLD:
        if int(current_second * 30) - last_shot_frame >= SHOT_DEBOUNCE_FRAMES:
            shot_type = None

            if ball_pos[1] < nose[1]:
                shot_type = "Smash"
                if elbow[1] < shoulder[1]:
                    feedback_good.append("Khuỷu tay cao – Smash tốt")
                else:
                    feedback_bad.append((elbow[0], elbow[1], "Khuỷu tay quá thấp cho Smash"))

            elif ball_pos[1] > avg_shoulder_y:
                shot_type = "Dink"
                if elbow[1] > shoulder[1]:
                    feedback_good.append("Khuỷu tay thấp – Dink kiểm soát tốt")
                else:
                    feedback_bad.append((elbow[0], elbow[1], "Khuỷu tay quá cao cho Dink"))

            # Forehand/Backhand theo vị trí bóng so với cơ thể
            threshold_x = 30
            if left_handed:
                if ball_pos[0] > body_center_x + threshold_x:
                    detected_shots.append({"type": "Forehand", "time": round(current_second, 2)})
                elif ball_pos[0] < body_center_x - threshold_x:
                    detected_shots.append({"type": "Backhand", "time": round(current_second, 2)})
            else:
                if ball_pos[0] < body_center_x - threshold_x:
                    detected_shots.append({"type": "Forehand", "time": round(current_second, 2)})
                elif ball_pos[0] > body_center_x + threshold_x:
                    detected_shots.append({"type": "Backhand", "time": round(current_second, 2)})

            if shot_type:
                detected_shots.append({"type": shot_type, "time": round(current_second, 2)})

    return {
        "shot_type": detected_shots,
        "feedback": {"good": feedback_good, "bad": feedback_bad},
        "time": round(current_second, 2)
    }



if __name__ == "__main__":
    import random
    class Point:
        def __init__(self, x, y): self.x, self.y = x, y

    fake_landmarks = [Point(random.random(), random.random()) for _ in range(33)]
    tracker = BallTracker()
    frame = np.zeros((720, 1280, 3), dtype=np.uint8)

    errors, good, shot = detect_player_feedback(fake_landmarks, 720, 1280, tracker, 0, frame)
    result = detect_shot_type_and_feedback(fake_landmarks, (640, 360), 1280, 720, 0.0, left_handed=False, last_shot_frame=0)

    print("Lỗi:", errors)
    print("Điểm tốt:", good)
    print("Cú đánh đơn lẻ:", shot)
    print("Phân tích cú đánh:", result)
