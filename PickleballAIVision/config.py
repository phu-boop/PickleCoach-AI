import mediapipe as mp
import numpy as np

# Cấu hình màu sắc
COLOR_GREEN = (0, 255, 0, 128)  # Xanh lá cho elip xác nhận
COLOR_RED = (0, 0, 255)        # Đỏ cho chấm
COLOR_WHITE = (255, 255, 255)   # Trắng cho đường kết nối
COLOR_SHADOW = (0, 0, 255, 100)  # Đỏ với độ mờ alpha = 100 (nếu cần)
COLOR_BALL = (0, 255, 255)     # Vàng cho bóng pickleball
COLOR_BALL_TRAIL = (0, 255, 0)  # Xanh lá cho đường di chuyển

# Cấu hình elip xác nhận con người
MAJOR_AXIS_FACTOR = 0.5   # Độ rộng elip = body_height * 0.5
MINOR_AXIS_FACTOR = 0.25  # Độ dẹt elip = body_height * 0.25 (tròn hơn)
ELIPSE_THICKNESS = 4
SHADOW_OFFSET_X = 20      # Dịch bóng con người sang phải
SHADOW_OFFSET_Y = 25      # Dịch bóng con người xuống dưới
ALPHA = 1               # Độ trong suốt

# Cấu hình nhận diện bóng pickleball
BALL_LOWER = np.array([61, 77, 78], dtype=np.uint8)
BALL_UPPER = np.array([71, 97, 98], dtype=np.uint8)
BALL_MIN_AREA = 80                     # Diện tích tối thiểu của bóng
BALL_MAX_AREA = 80                    # Diện tích tối đa của bóng
BALL_CIRCULARITY = 0.95                 # Độ tròn tối thiểu (0-1)

# Cấu hình bóng của bóng pickleball
BALL_SHADOW_MAJOR = 10    # Độ rộng elip bóng của bóng
BALL_SHADOW_MINOR = 5     # Độ dẹt elip bóng của bóng
BALL_SHADOW_OFFSET_X = 5  # Dịch bóng của bóng sang phải
BALL_SHADOW_OFFSET_Y = 7  # Dịch bóng của bóng xuống dưới

# Cấu hình theo dõi bóng
TRAIL_LENGTH = 50  # Nhiều frame hơn để mượt=
TRAIL_FADE_OUT_FRAMES = 4
TRAIL_LIFESPAN = 20        # Tuổi tối đa cho 1 đoạn trail (frame)
FADE_FACTOR = 1          # Càng nhỏ thì mờ nhanh
TRAIL_THICKNESS = 3
COLOR_BALL_TRAIL = (0, 255, 0)


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