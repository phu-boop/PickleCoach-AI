# course_suggester.py
import requests
from sentence_transformers import SentenceTransformer, util

# Load mô hình transform
model = SentenceTransformer("all-MiniLM-L6-v2")

def suggest_courses(errors: list, top_k=3):
    try:
        res = requests.get("http://localhost:8080/api/courses")
        res.raise_for_status()
        courses = res.json()
    except Exception as e:
        print(f"[ERROR] Cannot fetch courses: {e}")
        return []

    # Ghép lỗi thành một chuỗi lớn để vector hóa
    error_text = ". ".join(errors)
    error_embedding = model.encode(error_text, convert_to_tensor=True)

    # Tính điểm tương đồng giữa lỗi và từng course
    course_scores = []
    for course in courses:
        text = course.get("description", "") + " " + course.get("title", "")
        course_embedding = model.encode(text, convert_to_tensor=True)
        score = util.cos_sim(error_embedding, course_embedding).item()
        course_scores.append((score, course))

    # Sắp xếp và lấy top_k
    course_scores.sort(reverse=True, key=lambda x: x[0])
    top_courses = [course for _, course in course_scores[:top_k]]
    return top_courses
