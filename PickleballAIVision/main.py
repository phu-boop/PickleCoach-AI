import logging
import warnings
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
import traceback
from video_processor import process_video
from converter import convert_to_browser_compatible
from course_analyzer import recommend_courses

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('mediapipe').setLevel(logging.ERROR)
warnings.filterwarnings("ignore", category=UserWarning, module="google.protobuf.symbol_database")

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder setup
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}.mp4")
    raw_output_path = os.path.join(UPLOAD_DIR, f"{file_id}_raw.mp4")
    final_output_filename = f"{file_id}_annotated.mp4"
    final_output_path = os.path.join(OUTPUT_DIR, final_output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = process_video(input_path, raw_output_path)

        convert_to_browser_compatible(raw_output_path, final_output_path)

        feedback_errors = result.get("errors", [])
        detected_shots = result.get("detected_shots", [])  # Danh sách {type, time}
        detected_shot = result.get("detected_shot")  # Lấy cú đánh cuối

        recommendations = recommend_courses(feedback_errors, detected_shot)

        return JSONResponse({
            "status": "success",
            "video_url": f"/outputs/{final_output_filename}",
            "details": {
                "frame_count": result.get("frame_count", 0),
                "good_points": result.get("good_points", []),
                "errors": feedback_errors,
                "detected_shots": detected_shots,  # Bao gồm timestamp
                "detected_shot": detected_shot
            },
            "detected_shots": detected_shots,  # Trả về riêng
            "recommended_courses": recommendations
        })

    except Exception as e:
        logging.error(f"Error: {str(e)}\n{traceback.format_exc()}")
        return JSONResponse({
            "status": "error",
            "message": str(e),
            "details": traceback.format_exc(),
            "recommended_courses": [],
            "detected_shots": []
        }, status_code=500)

    finally:
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(raw_output_path):
            os.remove(raw_output_path)