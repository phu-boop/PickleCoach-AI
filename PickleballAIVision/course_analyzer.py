import logging
import requests
from urllib.parse import urlparse

def is_valid_url(url):
    """Kiểm tra xem URL có hợp lệ không (bắt đầu bằng http:// hoặc https://)."""
    return isinstance(url, str) and (url.startswith("http://") or url.startswith("https://"))

def recommend_courses(feedback_errors, detected_shot):
    """Đề xuất khóa học dựa trên lỗi tư thế và loại cú đánh."""
    try:
        backend_url = "http://localhost:8080/api/courses"
        response = requests.get(backend_url, timeout=5)
        response.raise_for_status()

        try:
            courses = response.json()
        except ValueError as e:
            logging.error(f"[ERROR] Invalid JSON response: {response.text}")
            return []

        recommendations = []
        added_course_ids = set()  # Tránh thêm trùng khóa học

        # Bản đồ lỗi sang skill
        error_to_skill = {
            "Shoulders not aligned": ["FOREHAND", "BACKHAND", "SERVE", "VOLLEY", "SMASH", "DRIVE"],
            "Hips not rotated enough": ["FOREHAND", "BACKHAND", "SERVE", "SMASH", "DRIVE"],
            "Wrist not firm enough": ["RETURN", "VOLLEY", "DRIVE"],
            "Wrist not soft enough for dink": ["DINK"],
            "Wrist angle incorrect for backhand": ["BACKHAND"],
            "Shoulder not raised enough": ["LOB"],
            "Wrist not snapped enough": ["SMASH"],
            "Shoulders too high for drop shot": ["DROP_SHOT"],
            "Lead foot should be forward": ["SERVE"],
            "Knees not bent enough": ["VOLLEY", "BLOCK"]
        }

        user_level = "BEGINNER"  # Giả định mặc định

        # Lấy loại cú đánh từ detected_shot (nếu là dict, lấy type)
        shot_type = (detected_shot["type"].upper() if isinstance(detected_shot, dict) and "type" in detected_shot 
                     else detected_shot.upper() if isinstance(detected_shot, str) else None)

        for course in courses:
            if course.get("levelRequired") != user_level:
                continue

            course_id = course.get("id", "unknown")
            matched_by_error = False
            matched_by_shot = False

            for lesson in course.get("lessons", []):
                skill_type = lesson.get("skillType")
                video_url = lesson.get("videoUrl")

                if not is_valid_url(video_url):
                    continue

                # Kiểm tra lỗi tư thế
                for error in feedback_errors:
                    error_message = error[2]  # Lấy thông điệp lỗi từ tuple (x, y, msg)
                    for error_key, related_skills in error_to_skill.items():
                        if error_key.lower() in error_message.lower() and skill_type in related_skills:
                            matched_by_error = True
                            break
                    if matched_by_error:
                        break

                # Kiểm tra theo cú đánh
                if shot_type and skill_type == shot_type:
                    matched_by_shot = True

            # Nếu có match và chưa được thêm
            if (matched_by_error or matched_by_shot) and course_id not in added_course_ids:
                recommendations.append({
                    "id": course_id,
                    "title": course.get("title", ""),
                    "description": course.get("description", ""),
                    "thumbnailUrl": course.get("thumbnailUrl", ""),
                    "levelRequired": course.get("levelRequired", ""),
                    "matchedReason": "Error" if matched_by_error else "Detected Shot"
                })
                added_course_ids.add(course_id)

        print(f"[INFO] Found {len(recommendations)} course(s) matching errors or shot.")
        for c in recommendations:
            print(f" - {c['title']} ({c['matchedReason']})")

        return recommendations

    except requests.RequestException as e:
        logging.error(f"[ERROR] Failed to fetch courses: {str(e)}. Response: {getattr(e.response, 'text', 'No response')}")
        return []