from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
from analyze import analyze_video, convert_to_browser_compatible

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}.mp4")

    # Tạo file tạm cho raw_output trong uploads
    raw_output_path = os.path.join(UPLOAD_DIR, f"{file_id}_raw.mp4")

    # file đầu ra chuẩn browser
    final_output_filename = f"{file_id}_annotated.mp4"
    final_output_path = os.path.join(OUTPUT_DIR, final_output_filename)

    # Lưu file gốc
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Phân tích video và xuất file raw tạm thời
    result = analyze_video(input_path, raw_output_path)

    # Chuyển định dạng và lưu file cuối ra outputs/
    convert_to_browser_compatible(raw_output_path, final_output_path)

    # Dọn dẹp file tạm
    os.remove(raw_output_path)
    os.remove(input_path)

    # Trả link truy cập video đã phân tích
    video_url = f"/outputs/{final_output_filename}"

    return JSONResponse({
        "status": "success",
        "video_url": video_url,
        "details": result
    })
