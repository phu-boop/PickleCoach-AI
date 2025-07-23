import logging
import warnings
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
from video_processor import process_video
from shadow_detector import ShadowDetector
from converter import convert_to_browser_compatible

# Suppress MediaPipe and Protobuf warnings
logging.getLogger('mediapipe').setLevel(logging.ERROR)
warnings.filterwarnings("ignore", category=UserWarning, module="google.protobuf.symbol_database")

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thư mục lưu trữ
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mount thư mục outputs để truy cập file video
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Tạo ID duy nhất cho file
    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}.mp4")
    raw_output_path = os.path.join(UPLOAD_DIR, f"{file_id}_raw.mp4")
    final_output_filename = f"{file_id}_annotated.mp4"
    final_output_path = os.path.join(OUTPUT_DIR, final_output_filename)

    try:
        # Lưu file đầu vào
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Khởi tạo shadow detector
        shadow_detector = ShadowDetector()

        # Xử lý video
        result = process_video(input_path, raw_output_path, shadow_detector)

        # Chuyển đổi video sang định dạng tương thích trình duyệt
        convert_to_browser_compatible(raw_output_path, final_output_path)

        # Trả về URL video và chi tiết
        video_url = f"/outputs/{final_output_filename}"
        return JSONResponse({
            "status": "success",
            "video_url": video_url,
            "details": result
        })

    except Exception as e:
        # Xử lý lỗi
        return JSONResponse({
            "status": "error",
            "message": str(e)
        }, status_code=500)

    finally:
        # Dọn dẹp file tạm
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(raw_output_path):
            os.remove(raw_output_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)