# feedback.py
import numpy as np
from typing import List, Tuple, Optional, Dict

# Ngưỡng, hằng số có thể lấy từ config nếu cần
DISTANCE_THRESHOLD = 20

def make_error(title: str, description: str, position: Optional[Tuple[int, int]] = None) -> Dict:
    item = {"title": title, "description": description}
    if position is not None:
        item["position"] = {"x": int(position[0]), "y": int(position[1])}
    return item

def make_good(title: str, description: str) -> Dict:
    return {"title": title, "description": description}

def detect_shot_type_and_feedback(
    landmarks: List,
    ball_pos: Optional[Tuple[int, int]],
    width: int,
    height: int,
    current_second: float,
    left_handed: bool,
    last_shot_frame: int = 0
) -> Dict:
    """
    Trả về:
    {
      "shot_type": [ {"type": "Forehand", "time": 1.23}, ... ],
      "feedback": { "good": [ {title, description}, ... ], "bad": [ {title, description, position?}, ... ] },
      "time": 1.23
    }
    """
    feedback_good = []
    feedback_bad = []
    detected_shots = []

    if not landmarks or len(landmarks) < 17:
        feedback_bad.append(make_error("Landmarks không đủ", "Không đủ điểm mốc để phân tích chuyển động"))
        return {
            "shot_type": [],
            "feedback": {"good": feedback_good, "bad": feedback_bad},
            "time": round(current_second, 2)
        }

    # Lấy tọa độ cơ bản
    def pt(idx):
        return (int(landmarks[idx].x * width), int(landmarks[idx].y * height))

    left_shoulder = pt(11)
    right_shoulder = pt(12)
    left_elbow = pt(13)
    right_elbow = pt(14)
    left_wrist = pt(15)
    right_wrist = pt(16)
    nose = pt(0)

    body_center_x = (left_shoulder[0] + right_shoulder[0]) // 2
    avg_shoulder_y = (left_shoulder[1] + right_shoulder[1]) // 2

    wrist = left_wrist if left_handed else right_wrist
    elbow = left_elbow if left_handed else right_elbow
    shoulder = left_shoulder if left_handed else right_shoulder

    if ball_pos is None or ball_pos == (0, 0):
        feedback_bad.append(make_error("Bóng không xác định", "Không thể phát hiện bóng trong khung hình"))
        return {
            "shot_type": [],
            "feedback": {"good": feedback_good, "bad": feedback_bad},
            "time": round(current_second, 2)
        }

    ball_distance = np.linalg.norm(np.array(ball_pos) - np.array(wrist))

    # Nếu bóng gần cổ tay (ngưỡng) => coi là cú đánh
    if ball_distance < DISTANCE_THRESHOLD:
        # Tạo shot_type theo chiều cao bóng so với mũi
        shot_type = None
        if ball_pos[1] < nose[1]:
            shot_type = "Smash"
            if elbow[1] < shoulder[1]:
                feedback_good.append(make_good("Khuỷu tay cao", "Khuỷu tay nâng cao phù hợp cho Smash"))
            else:
                feedback_bad.append(make_error("Khuỷu tay thấp cho Smash", "Khuỷu tay quá thấp khi thực hiện Smash", position=elbow))
        elif ball_pos[1] > avg_shoulder_y:
            shot_type = "Dink"
            if elbow[1] > shoulder[1]:
                feedback_good.append(make_good("Khuỷu tay thấp cho Dink", "Khuỷu tay ở vị trí phù hợp cho Dink"))
            else:
                feedback_bad.append(make_error("Khuỷu tay cao cho Dink", "Khuỷu tay quá cao cho cú Dink", position=elbow))

        # Forehand / Backhand theo trục X so với body center
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

        # Một vài check bổ sung (ví dụ tư thế vai / đầu gối)
        # Vai lệch nhiều -> lỗi
        shoulder_diff = abs(left_shoulder[1] - right_shoulder[1])
        if shoulder_diff > 30:
            feedback_bad.append(make_error("Vai không thẳng", "Vai giữa hai bên không thẳng, ảnh hưởng đến kỹ thuật đánh", position=((left_shoulder[0]+right_shoulder[0])//2, (left_shoulder[1]+right_shoulder[1])//2)))
        else:
            feedback_good.append(make_good("Vai cân đối", "Vai ở vị trí tương đối cân đối"))

    # Nếu ball_distance >= ngưỡng, không coi là cú đánh -> không thêm shot
    return {
        "shot_type": detected_shots,
        "feedback": {"good": feedback_good, "bad": feedback_bad},
        "time": round(current_second, 2)
    }
