# # pose_utils.py
# import cv2

# def draw_pose_landmarks(overlay, landmarks, BODY_LANDMARKS, BODY_CONNECTIONS, w, h, COLOR_RED, COLOR_WHITE):
#     # Vẽ connections
#     for connection in BODY_CONNECTIONS:
#         start_idx = connection[0].value
#         end_idx = connection[1].value
#         start_point = landmarks[start_idx]
#         end_point = landmarks[end_idx]
#         start_coords = (int(start_point.x * w), int(start_point.y * h))
#         end_coords = (int(end_point.x * w), int(end_point.y * h))
#         cv2.line(overlay, start_coords, end_coords, COLOR_WHITE, 2)

#     # Vẽ landmarks
#     for landmark in BODY_LANDMARKS:
#         point = landmarks[landmark]
#         x_point = int(point.x * w)
#         y_point = int(point.y * h)
#         cv2.circle(overlay, (x_point, y_point), 5, COLOR_RED, -1)


# def draw_ellipse_under_player(overlay, landmarks, mp_pose, w, h, COLOR_GREEN, MAJOR_AXIS_FACTOR, MINOR_AXIS_FACTOR, ELIPSE_THICKNESS):
#     left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
#     right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
#     left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
#     right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

#     x = int((left_ankle.x + right_ankle.x) / 2 * w)
#     y = int((left_ankle.y + right_ankle.y) / 2 * h)
#     shoulder_y = (left_shoulder.y + right_shoulder.y) / 2 * h
#     ankle_y = (left_ankle.y + right_ankle.y) / 2 * h
#     body_height = abs(shoulder_y - ankle_y)

#     major_axis = int(body_height * MAJOR_AXIS_FACTOR)
#     minor_axis = int(body_height * MINOR_AXIS_FACTOR)

#     center = (x, y + 15)
#     axes = (major_axis, minor_axis)
#     cv2.ellipse(overlay, center, axes, 0, 0, 360, COLOR_GREEN, ELIPSE_THICKNESS)
