import mediapipe as mp
import numpy as np

# Cấu hình màu sắc
COLOR_GREEN = (0, 255, 0, 128)  # Xanh lá với alpha 128
COLOR_RED = (0, 0, 255)        # Đỏ cho chấm
COLOR_WHITE = (255, 255, 255)   # Trắng cho đường kết nối
COLOR_SHADOW = (50, 50, 50, 128)  # Xám đen cho bóng

# Cấu hình elip
MAJOR_AXIS_FACTOR = 0.5   # Độ rộng elip = body_height * 0.5
MINOR_AXIS_FACTOR = 0.25  # Độ dẹt elip = body_height * 0.25 (tròn hơn)
ELIPSE_THICKNESS = 4
SHADOW_OFFSET_X = 20      # Dịch bóng sang phải
SHADOW_OFFSET_Y = 25      # Dịch bóng xuống dưới
ALPHA = 0.5               # Độ trong suốt

# Danh sách điểm mốc cơ thể (loại bỏ điểm trên mặt)
BODY_LANDMARKS = [
    mp.solutions.pose.PoseLandmark.LEFT_SHOULDER,
    mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER,
    mp.solutions.pose.PoseLandmark.LEFT_ELBOW,
    mp.solutions.pose.PoseLandmark.RIGHT_ELBOW,
    mp.solutions.pose.PoseLandmark.LEFT_WRIST,
    mp.solutions.pose.PoseLandmark.RIGHT_WRIST,
    mp.solutions.pose.PoseLandmark.LEFT_HIP,
    mp.solutions.pose.PoseLandmark.RIGHT_HIP,
    mp.solutions.pose.PoseLandmark.LEFT_KNEE,
    mp.solutions.pose.PoseLandmark.RIGHT_KNEE,
    mp.solutions.pose.PoseLandmark.LEFT_ANKLE,
    mp.solutions.pose.PoseLandmark.RIGHT_ANKLE
]

# Danh sách kết nối cơ thể
BODY_CONNECTIONS = [
    (mp.solutions.pose.PoseLandmark.LEFT_SHOULDER, mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER),
    (mp.solutions.pose.PoseLandmark.LEFT_SHOULDER, mp.solutions.pose.PoseLandmark.LEFT_ELBOW),
    (mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER, mp.solutions.pose.PoseLandmark.RIGHT_ELBOW),
    (mp.solutions.pose.PoseLandmark.LEFT_ELBOW, mp.solutions.pose.PoseLandmark.LEFT_WRIST),
    (mp.solutions.pose.PoseLandmark.RIGHT_ELBOW, mp.solutions.pose.PoseLandmark.RIGHT_WRIST),
    (mp.solutions.pose.PoseLandmark.LEFT_SHOULDER, mp.solutions.pose.PoseLandmark.LEFT_HIP),
    (mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER, mp.solutions.pose.PoseLandmark.RIGHT_HIP),
    (mp.solutions.pose.PoseLandmark.LEFT_HIP, mp.solutions.pose.PoseLandmark.RIGHT_HIP),
    (mp.solutions.pose.PoseLandmark.LEFT_HIP, mp.solutions.pose.PoseLandmark.LEFT_KNEE),
    (mp.solutions.pose.PoseLandmark.RIGHT_HIP, mp.solutions.pose.PoseLandmark.RIGHT_KNEE),
    (mp.solutions.pose.PoseLandmark.LEFT_KNEE, mp.solutions.pose.PoseLandmark.LEFT_ANKLE),
    (mp.solutions.pose.PoseLandmark.RIGHT_KNEE, mp.solutions.pose.PoseLandmark.RIGHT_ANKLE),
]

# Cấu hình nhận diện bóng
SHADOW_LOWER = np.array([0, 0, 0])       # Ngưỡng dưới HSV cho bóng
SHADOW_UPPER = np.array([180, 255, 100]) # Ngưỡng trên HSV cho bóng
SHADOW_MIN_AREA = 100                    # Diện tích tối thiểu của bóng