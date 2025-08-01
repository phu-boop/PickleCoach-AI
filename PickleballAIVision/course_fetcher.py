import requests

API_URL = "http://localhost:8080/api/courses"

def fetch_courses():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        courses = response.json()
        print("[INFO] Fetched", len(courses), "courses.")
        for course in courses:
            print(f"- {course['title']}: {course['description'][:60]}...")
        return courses
    except requests.exceptions.RequestException as e:
        print("[ERROR] Cannot fetch courses:", e)
        return []

if __name__ == "__main__":
    fetch_courses()
