from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from dotenv import load_dotenv
from google.genai import Client
import os
import json
from collections import Counter

# Tải biến môi trường từ file .env
load_dotenv()

app = FastAPI(title="Adaptive Quiz Generator API")


class QuizRequest(BaseModel):
    learner_id: str
    topic: str
    level: str = "medium"
    # Dùng default_factory để tránh mutable default
    last_results: List[Dict[str, Any]] = Field(default_factory=list)
    learner_statistics: Dict[str, Any] = Field(default_factory=dict)


def analyze_learner_weakness(last_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Phân tích điểm yếu của learner từ lịch sử quiz_results"""
    print(f"[ANALYZE] Processing {len(last_results)} historical results")

    if not last_results:
        return {
            "weak_topics": [],
            "difficulty_needed": "medium",
            "focus_areas": [],
            "correct_rate": 0.5,
            "total_attempts": 0,
            "needs_review": False
        }

    # Phân tích câu trả lời sai và đúng
    wrong_answers = [result for result in last_results if not result.get("is_correct", True)]
    correct_answers = [result for result in last_results if result.get("is_correct", False)]

    print(f"[ANALYZE] Wrong answers: {len(wrong_answers)}, Correct answers: {len(correct_answers)}")

    # Đếm topics có nhiều câu sai
    wrong_topics = []
    for result in wrong_answers:
        topic = result.get("topic", "general")
        if topic:
            wrong_topics.append(topic)

    topic_weakness = Counter(wrong_topics)
    print(f"[ANALYZE] Topic weakness: {dict(topic_weakness)}")

    # Tỷ lệ đúng/sai
    total_questions = len(last_results)
    correct_rate = len(correct_answers) / total_questions if total_questions > 0 else 0.5

    # Xác định mức độ khó cần thiết
    if correct_rate > 0.8:
        difficulty_needed = "hard"
        print("[ANALYZE] Learner performing excellently -> increase difficulty")
    elif correct_rate > 0.5:
        difficulty_needed = "medium"
        print("[ANALYZE] Learner at medium level -> maintain difficulty")
    else:
        difficulty_needed = "easy"
        print("[ANALYZE] Learner struggling -> decrease difficulty")

    # Lấy top 2 topics yếu nhất
    weak_topics = [topic for topic, count in topic_weakness.most_common(2) if count > 0]
    focus_areas = weak_topics[:2]  # Tập trung vào 2 topics yếu nhất

    analysis = {
        "weak_topics": weak_topics,
        "difficulty_needed": difficulty_needed,
        "focus_areas": focus_areas,
        "correct_rate": correct_rate,
        "total_attempts": total_questions,
        "needs_review": len(wrong_answers) > 0
    }

    print(f"[ANALYZE] Final analysis: {analysis}")
    return analysis


def generate_prompt(request: QuizRequest, weakness_analysis: Dict[str, Any]) -> str:
    """Tạo prompt thông minh dựa trên phân tích lịch sử quiz_results"""

    weak_topics = weakness_analysis.get("weak_topics", [])
    correct_rate = weakness_analysis.get("correct_rate", 0.5)
    needs_review = weakness_analysis.get("needs_review", False)
    focus_areas = weakness_analysis.get("focus_areas", [])
    difficulty_needed = weakness_analysis.get("difficulty_needed", "medium")

    # Xây dựng thông tin cá nhân hóa dựa trên phân tích
    personalized_info = ""

    if needs_review and weak_topics:
        personalized_info = f"""
🎯 PHÂN TÍCH LEARNER:
- ID: {request.learner_id}
- Tỷ lệ đúng gần đây: {correct_rate:.1%}
- Các chủ đề cần cải thiện: {', '.join(weak_topics)}
- Tập trung vào: {', '.join(focus_areas)}

📋 HƯỚNG DẪN TẠO QUIZ THÍCH ỨNG:
- 60% câu hỏi tập trung vào các chủ đề learner hay sai: {', '.join(focus_areas)}
- 40% câu hỏi ôn tập chung về {request.topic}
- Độ khó được điều chỉnh: {difficulty_needed}
- Giải thích chi tiết hơn để learner hiểu sâu và khắc phục lỗi
- Ưu tiên câu hỏi thực hành để cải thiện kỹ năng yếu
"""
    elif correct_rate > 0.8:
        personalized_info = f"""
🌟 PHÂN TÍCH LEARNER:
- ID: {request.learner_id} 
- Learner đang làm XUẤT SẮC (tỷ lệ đúng: {correct_rate:.1%})!
- Đã thành thạo các kiến thức cơ bản

🚀 HƯỚNG DẪN TẠO QUIZ THÁCH THỨC:
- Tăng độ khó lên mức cao để thách thức
- Kết hợp nhiều kỹ thuật phức tạp trong một câu hỏi
- Thêm các tình huống thi đấu thực tế khó
- Câu hỏi yêu cầu tư duy chiến thuật cao
"""
    else:
        personalized_info = f"""
📚 PHÂN TÍCH LEARNER:
- ID: {request.learner_id}
- Learner ở mức độ ổn định (tỷ lệ đúng: {correct_rate:.1%})
- Cần consolidate kiến thức và từng bước nâng cao

⚖️ HƯỚNG DẪN TẠO QUIZ CÂN BẰNG:
- Mix các mức độ từ dễ đến trung bình (70% dễ, 30% trung bình)
- Tập trung vào {request.topic} với kiến thức nền tảng
- Thêm một số câu ôn tập kiến thức cơ bản
- Giải thích rõ ràng để xây dựng nền tảng vững chắc
"""

    prompt = f"""
Tạo 5 câu hỏi quiz pickleball THÔNG MINH và THÍCH ỨNG về {request.topic}. 
Mức độ yêu cầu: {request.level}, nhưng được điều chỉnh dựa trên phân tích learner.

{personalized_info}

🎯 REQUIREMENTS:
- Câu hỏi thực tế, áp dụng được trong thi đấu pickleball thực tế
- Mỗi câu hỏi có giải thích chi tiết giúp learner cải thiện
- Ngôn ngữ tiếng Việt dễ hiểu, chuyên nghiệp
- Đáp án chính xác về mặt kỹ thuật pickleball
- Nếu learner hay sai chủ đề nào thì focus vào chủ đề đó

⚠️ Chỉ trả về JSON hợp lệ theo cấu trúc sau, KHÔNG kèm giải thích hay markdown:

{{
  "questions": [
    {{
      "question_text": "Câu hỏi chi tiết về kỹ thuật pickleball...",
      "options": [
        {{"id": 0, "text": "Đáp án A chi tiết", "is_correct": false}},
        {{"id": 1, "text": "Đáp án B chi tiết", "is_correct": true}},
        {{"id": 2, "text": "Đáp án C chi tiết", "is_correct": false}},
        {{"id": 3, "text": "Đáp án D chi tiết", "is_correct": false}}
      ],
      "explanation": "Giải thích chi tiết tại sao đáp án B đúng, tại sao các đáp án khác sai, và cách áp dụng thực tế trong thi đấu."
    }}
  ]
}}
"""
    return prompt.strip()


def get_gemini_client() -> Client:
    # Thay thế bằng khóa API THỰC SỰ của bạn
    api_key = "AIzaSyB2G_ptivaXlKuOMxVkcOQ28cu_gZha2VQ" 
    return Client(api_key=api_key)

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):
    print(f"\n{'=' * 60}")
    print(f"🤖 GENERATE ADAPTIVE QUIZ REQUEST")
    print(f"{'=' * 60}")
    print(f"Learner ID: {request.learner_id}")
    print(f"Topic: {request.topic}")
    print(f"Level: {request.level}")
    print(f"Historical results count: {len(request.last_results)}")

    try:
        client = get_gemini_client()

        # Phân tích learner từ lịch sử quiz_results
        weakness_analysis = analyze_learner_weakness(request.last_results)

        print(f"\n📊 LEARNER ANALYSIS SUMMARY:")
        print(f"- Total attempts: {weakness_analysis.get('total_attempts', 0)}")
        print(f"- Correct rate: {weakness_analysis.get('correct_rate', 0):.1%}")
        print(f"- Weak topics: {weakness_analysis.get('weak_topics', [])}")
        print(f"- Focus areas: {weakness_analysis.get('focus_areas', [])}")
        print(f"- Difficulty needed: {weakness_analysis.get('difficulty_needed', 'medium')}")
        print(f"- Needs review: {weakness_analysis.get('needs_review', False)}")

        # Tạo prompt cá nhân hóa
        prompt = generate_prompt(request, weakness_analysis)
        print(f"\n📝 GENERATING PROMPT... ({len(prompt)} characters)")

        # Sử dụng google-genai API
        print(f"🔄 CALLING GEMINI API...")
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        content = response.text
        print(f"✅ GEMINI RESPONSE RECEIVED ({len(content)} characters)")

        # Parse JSON response
        quiz_data = json.loads(content)

        # Thêm thông tin phân tích vào response để frontend sử dụng
        quiz_data["learner_analysis"] = {
            "weak_topics": weakness_analysis.get("weak_topics", []),
            "focus_areas": weakness_analysis.get("focus_areas", []),
            "correct_rate": weakness_analysis.get("correct_rate", 0.5),
            "difficulty_adjusted": weakness_analysis.get("difficulty_needed", "medium"),
            "total_attempts": weakness_analysis.get("total_attempts", 0),
            "needs_improvement": weakness_analysis.get("needs_review", False)
        }

        questions_count = len(quiz_data.get("questions", []))
        print(f"🎯 ADAPTIVE QUIZ GENERATED SUCCESSFULLY!")
        print(f"- Questions created: {questions_count}")
        print(f"- Tailored for learner: {request.learner_id}")
        print(f"{'=' * 60}\n")

        return quiz_data

    except json.JSONDecodeError as e:
        print(f"❌ JSON DECODE ERROR: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail=f"Phản hồi không phải JSON hợp lệ từ mô hình: {str(e)}",
        )
    except Exception as e:
        print(f"❌ EXCEPTION in generate_quiz: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi tạo quiz thích ứng: {str(e)}")


# API để debug (optional)
@app.get("/learner-analysis/{learner_id}")
def get_learner_analysis_debug(learner_id: str):
    """API để xem phân tích learner (for debugging)"""
    return {
        "message": f"Analysis endpoint for learner {learner_id}",
        "note": "This endpoint can be used to debug learner analysis"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Adaptive Quiz Generator"}


if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting Adaptive Quiz Generator API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8001)