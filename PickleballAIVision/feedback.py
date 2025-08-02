import cv2
import numpy as np
import math
from typing import Tuple, List, Optional

# Giả định các tham số từ config (nếu không có file config, khai báo mặc định)
BALL_LOWER = np.array([20, 100, 100], dtype=np.uint8)  # Màu HSV tối thiểu
BALL_UPPER = np.array([30, 255, 255], dtype=np.uint8)  # Màu HSV tối đa
BALL_MIN_AREA = 50
BALL_MAX_AREA = 500
BALL_CIRCULARITY = 0.7
COLOR_BALL = (0, 255, 0)  # Màu xanh lá (BGR)
COLOR_BALL_TRAIL = (0, 0, 255)  # Màu đỏ (BGR)
TRAIL_LIFESPAN = 30  # Số khung hình lưu trữ đường đi
FADE_FACTOR = 10  # Hệ số mờ dần
TRAIL_THICKNESS = 2

class BallTracker:
    """Lớp theo dõi bóng trong video sử dụng OpenCV."""
    
    def __init__(self):
        """Khởi tạo bộ theo dõi bóng với danh sách vị trí bóng."""
        self.ball_positions: List[dict] = []
        self.max_positions = 100  # Giới hạn số lượng vị trí lưu trữ

    def detect_ball(self, frame: np.ndarray, frame_idx: int) -> Optional[Tuple[int, int]]:
        """Phát hiện bóng trong khung hình và trả về tọa độ trung tâm.
        
        Args:
            frame (np.ndarray): Khung hình đầu vào (BGR)
            frame_idx (int): Chỉ số khung hình
            
        Returns:
            Optional[Tuple[int, int]]: Tọa độ (x, y) của bóng, hoặc None nếu không phát hiện
        """
        if frame is None or frame.size == 0:
            print(f"[Khung hình {frame_idx}] Lỗi: Khung hình không hợp lệ.")
            return None

        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, BALL_LOWER, BALL_UPPER)

        # Áp dụng bộ lọc hình thái để giảm nhiễu
        mask = cv2.erode(mask, None, iterations=1)
        mask = cv2.dilate(mask, None, iterations=1)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            print(f"[Khung hình {frame_idx}] Không phát hiện bóng.")
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
                print(f"[Khung hình {frame_idx}] Phát hiện bóng tại {center} (diện tích={area:.1f}, độ tròn={circularity:.2f})")
                return center

        print(f"[Khung hình {frame_idx}] Không tìm thấy bóng hợp lệ sau khi lọc.")
        return None

    def draw_ball(self, frame: np.ndarray, ball_center: Optional[Tuple[int, int]]) -> None:
        """Vẽ bóng trên khung hình.
        
        Args:
            frame (np.ndarray): Khung hình đầu vào
            ball_center (Optional[Tuple[int, int]]): Tọa độ trung tâm bóng
        """
        if ball_center and 0 <= ball_center[0] < frame.shape[1] and 0 <= ball_center[1] < frame.shape[0]:
            cv2.circle(frame, ball_center, 10, COLOR_BALL, -1)

    def update_trail(self, ball_center: Optional[Tuple[int, int]], frame_idx: int) -> None:
        """Cập nhật đường đi của bóng.
        
        Args:
            ball_center (Optional[Tuple[int, int]]): Tọa độ trung tâm bóng
            frame_idx (int): Chỉ số khung hình
        """
        if ball_center:
            self.ball_positions.append({"pos": ball_center, "age": 0})
            print(f"[Khung hình {frame_idx}] Thêm bóng vào đường đi: {ball_center}")

        for point in self.ball_positions:
            point["age"] += 1

        self.ball_positions = [p for p in self.ball_positions if p["age"] < TRAIL_LIFESPAN]
        if len(self.ball_positions) > self.max_positions:
            self.ball_positions = self.ball_positions[-self.max_positions:]
        print(f"[Khung hình {frame_idx}] Độ dài đường đi sau khi dọn dẹp: {len(self.ball_positions)}")

    def draw_ball_trail(self, frame: np.ndarray) -> None:
        """Vẽ đường đi của bóng với hiệu ứng mờ dần.
        
        Args:
            frame (np.ndarray): Khung hình đầu vào
        """
        for i in range(1, len(self.ball_positions)):
            p1 = self.ball_positions[i - 1]["pos"]
            p2 = self.ball_positions[i]["pos"]
            age = self.ball_positions[i]["age"]

            if p1 is None or p2 is None or not (0 <= p1[0] < frame.shape[1] and 0 <= p1[1] < frame.shape[0]):
                continue

            opacity = max(0, 255 - int(age * FADE_FACTOR))
            color = COLOR_BALL_TRAIL  # Chỉ dùng RGB
            overlay = frame.copy()
            cv2.line(overlay, p1, p2, color, TRAIL_THICKNESS)
            alpha = opacity / 255.0
            cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

def detect_player_feedback(landmarks: List, height: int, width: int) -> Tuple[List, List]:
    """Phát hiện phản hồi về tư thế người chơi dựa trên landmarks.
    
    Args:
        landmarks (List): Danh sách landmarks từ MediaPipe
        height (int): Chiều cao khung hình
        width (int): Chiều rộng khung hình
        
    Returns:
        Tuple[List, List]: Danh sách lỗi và điểm tốt
    """
    if len(landmarks) < 12:
        return [], []

    feedback_errors = []
    good_points = []

    left_shoulder = landmarks[11]
    right_shoulder = landmarks[12]

    left_shoulder_x = int(left_shoulder.x * width)
    left_shoulder_y = int(left_shoulder.y * height)
    right_shoulder_x = int(right_shoulder.x * width)
    right_shoulder_y = int(right_shoulder.y * height)

    shoulder_diff = abs(left_shoulder_y - right_shoulder_y)
    if shoulder_diff > 50:
        feedback_errors.append((right_shoulder_x, right_shoulder_y, f"Vai không thẳng hàng ({shoulder_diff}px)"))
    else:
        good_points.append("Vai thẳng hàng")

    return feedback_errors, good_points

def get_landmark_px(landmarks: List, idx: int, width: int, height: int) -> Tuple[int, int]:
    """Chuyển đổi tọa độ chuẩn hóa của landmark sang pixel.
    
    Args:
        landmarks (List): Danh sách landmarks
        idx (int): Chỉ số landmark
        width (int): Chiều rộng khung hình
        height (int): Chiều cao khung hình
        
    Returns:
        Tuple[int, int]: Tọa độ (x, y) trong pixel
    """
    if idx >= len(landmarks):
        raise IndexError(f"Landmark index {idx} vượt quá giới hạn")
    lm = landmarks[idx]
    return int(lm.x * width), int(lm.y * height)

def euclidean_distance(p1: Tuple[int, int], p2: Tuple[int, int]) -> float:
    """Tính khoảng cách Euclid giữa hai điểm.
    
    Args:
        p1 (Tuple[int, int]): Điểm đầu tiên
        p2 (Tuple[int, int]): Điểm thứ hai
        
    Returns:
        float: Khoảng cách
    """
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def detect_shot_type_and_feedback(landmarks: List, ball_pos: Tuple[int, int], width: int, height: int, 
                                current_second: float, left_handed: bool) -> dict:
    """Phát hiện loại cú đánh và phản hồi dựa trên tư thế và vị trí bóng.
    
    Args:
        landmarks (List): Danh sách landmarks từ MediaPipe
        ball_pos (Tuple[int, int]): Vị trí bóng
        width (int): Chiều rộng khung hình
        height (int): Chiều cao khung hình
        current_second (float): Thời gian hiện tại (giây)
        left_handed (bool): Người chơi thuận tay trái
        
    Returns:
        dict: Thông tin loại cú đánh và phản hồi
    """
    if len(landmarks) < 24:
        return {"shot_type": "Không_xác_định", "feedback": {"good": [], "bad": ["Dữ liệu landmarks không đủ"]}, "time": round(current_second, 2)}

    feedback_good = []
    feedback_bad = []

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

    dist_to_right_wrist = euclidean_distance(right_wrist, ball_pos)
    dist_to_left_wrist = euclidean_distance(left_wrist, ball_pos)
    if min(dist_to_right_wrist, dist_to_left_wrist) < 40:
        return {
            "shot_type": "Đang_cầm_bóng",
            "feedback": {"good": [], "bad": ["Người chơi có thể đang cầm bóng – không phải cú đánh"]},
            "time": round(current_second, 2)
        }

    shot_type = "Không_xác_định"
    if ball_pos[1] < nose[1]:
        shot_type = "Smash"
        if avg_elbow_y < avg_shoulder_y:
            feedback_good.append("Khuỷu tay cao cho Smash")
        else:
            feedback_bad.append("Khuỷu tay quá thấp cho Smash")
        if avg_wrist_y < avg_elbow_y:
            feedback_good.append("Động tác cổ tay thực hiện tốt")
        else:
            feedback_bad.append("Cổ tay quá thấp – Smash yếu")

    elif abs(ball_pos[1] - avg_hip_y) < 40:
        shot_type = "Dink"
        if avg_wrist_y > avg_elbow_y:
            feedback_good.append("Cổ tay thấp – Dink kiểm soát tốt")
        else:
            feedback_bad.append("Cổ tay quá cao cho Dink")
        if abs(left_hip[1] - right_hip[1]) < 20:
            feedback_good.append("Tư thế cân bằng")
        else:
            feedback_bad.append("Vị trí hông không ổn định")

    elif avg_shoulder_y < ball_pos[1] < avg_hip_y:
        shot_type = "Drive"
        if avg_wrist_y > avg_elbow_y:
            feedback_good.append("Động tác follow-through tốt")
        else:
            feedback_bad.append("Cổ tay quá cao – vung tay chưa hoàn chỉnh")
        shoulder_width = abs(left_shoulder[0] - right_shoulder[0])
        hip_width = abs(left_hip[0] - right_hip[0])
        if shoulder_width < hip_width:
            feedback_good.append("Tư thế đứng rộng – ổn định")
        else:
            feedback_bad.append("Tư thế đứng hẹp")

    elif ball_pos[1] < avg_shoulder_y:
        shot_type = "Volley"
        shoulder_diff = abs(left_shoulder[1] - right_shoulder[1])
        if shoulder_diff < 30:
            feedback_good.append("Vai thẳng hàng")
        else:
            feedback_bad.append("Vai không thẳng hàng")
        if avg_elbow_y < avg_shoulder_y:
            feedback_good.append("Khuỷu tay cao hơn vai")
        else:
            feedback_bad.append("Khuỷu tay quá thấp")

    else:
        body_center_x = (left_shoulder[0] + right_shoulder[0]) // 2
        if left_handed:
            if ball_pos[0] > body_center_x + 30:
                shot_type = "Forehand"
                feedback_good.append("Phát hiện cú đánh Forehand")
                if right_wrist[0] < right_elbow[0]:
                    feedback_good.append("Mở rộng cổ tay tốt")
                else:
                    feedback_bad.append("Cổ tay không được mở rộng")
            elif ball_pos[0] < body_center_x - 30:
                shot_type = "Backhand"
                feedback_good.append("Phát hiện cú đánh Backhand")
                if right_wrist[0] > right_elbow[0]:
                    feedback_good.append("Động tác chéo cơ thể tốt")
                else:
                    feedback_bad.append("Cổ tay không chéo cơ thể")
        else:
            if ball_pos[0] < body_center_x - 30:
                shot_type = "Forehand"
                feedback_good.append("Phát hiện cú đánh Forehand")
                if right_wrist[0] < right_elbow[0]:
                    feedback_good.append("Mở rộng cổ tay tốt")
                else:
                    feedback_bad.append("Cổ tay không được mở rộng")
            elif ball_pos[0] > body_center_x + 30:
                shot_type = "Backhand"
                feedback_good.append("Phát hiện cú đánh Backhand")
                if right_wrist[0] > right_elbow[0]:
                    feedback_good.append("Động tác chéo cơ thể tốt")
                else:
                    feedback_bad.append("Cổ tay không chéo cơ thể")

    return {
        "shot_type": shot_type,
        "feedback": {"good": feedback_good, "bad": feedback_bad},
        "time": round(current_second, 2)
    }

if __name__ == "__main__":
    # Ví dụ sử dụng (cần thêm MediaPipe để chạy đầy đủ)
    cap = cv2.VideoCapture(0)
    tracker = BallTracker()
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        ball_pos = tracker.detect_ball(frame, 0)
        tracker.draw_ball(frame, ball_pos)
        tracker.update_trail(ball_pos, 0)
        tracker.draw_ball_trail(frame)
        cv2.imshow("Ball Tracking", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()