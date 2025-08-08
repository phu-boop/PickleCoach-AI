# course_analyzer.py
import logging
import requests

def is_valid_url(url):
    return isinstance(url, str) and (url.startswith("http://") or url.startswith("https://"))

# Map từ khóa lỗi sang skill types tương ứng (chuẩn hóa)
KEYWORD_TO_SKILL = {
    "khuỷu tay": ["SMASH", "DINK"],
    "khuỷu tay thấp": ["SMASH"],
    "khuỷu tay cao": ["SMASH", "DINK"],
    "vai": ["FOREHAND", "BACKHAND", "VOLLEY"],
    "vai không thẳng": ["FOREHAND", "BACKHAND"],
    "wrist": ["FOREHAND", "BACKHAND"],
    "dink": ["DINK"],
    "smash": ["SMASH"],
    "forehand": ["FOREHAND"],
    "backhand": ["BACKHAND"]
}

def recommend_courses(feedback_errors, detected_shot):
    """
    feedback_errors: list of {title, description, position?}
    detected_shot: dict like {"type": "...", "time": 1.23} or None
    """
    try:
        backend_url = "http://localhost:8080/api/courses"
        resp = requests.get(backend_url, timeout=5)
        resp.raise_for_status()
        try:
            courses = resp.json()
        except ValueError:
            logging.error("[course_analyzer] Invalid JSON from courses endpoint")
            return []

        user_level = "BEGINNER"  # could be dynamic
        shot_type = None
        if isinstance(detected_shot, dict):
            shot_type = detected_shot.get("type", "").upper()

        recommendations = []
        added = set()

        # Tạo set skill candidates từ các lỗi
        skill_candidates = set()
        for e in feedback_errors:
            text = (e.get("description","") + " " + e.get("title","")).lower()
            for kw, skills in KEYWORD_TO_SKILL.items():
                if kw in text:
                    for s in skills:
                        skill_candidates.add(s)

        # Nếu có detected shot, thêm vào candidates
        if shot_type:
            skill_candidates.add(shot_type.upper())

        # Duyệt khóa học, match nếu lesson.skillType in candidates
        for course in courses:
            if course.get("levelRequired") and course.get("levelRequired") != user_level:
                # skip courses not for this user level (optional)
                continue

            course_id = course.get("id")
            matched_reasons = []
            for lesson in course.get("lessons", []):
                skill = lesson.get("skillType", "").upper()
                video_url = lesson.get("videoUrl")
                if not is_valid_url(video_url):
                    continue
                if skill in skill_candidates:
                    matched_reasons.append(skill)

            if matched_reasons and course_id not in added:
                recommendations.append({
                    "id": course_id,
                    "title": course.get("title", ""),
                    "description": course.get("description", ""),
                    "thumbnailUrl": course.get("thumbnailUrl", ""),
                    "levelRequired": course.get("levelRequired", ""),
                    "matchedReason": ", ".join(sorted(set(matched_reasons)))
                })
                added.add(course_id)

        logging.info(f"[course_analyzer] {len(recommendations)} recommendations found")
        return recommendations

    except requests.RequestException as e:
        logging.error(f"[course_analyzer] Failed to fetch courses: {e}")
        return []
