# Dockerfile for quiz-generator

# 1. Chọn base image Python nhẹ
FROM python:3.11-slim

# 2. Set thư mục làm việc trong container
WORKDIR /app

# 3. Copy file requirements.txt (tạo trước trong thư mục project)
# Nếu chưa có, tạo nội dung như:
# fastapi
# uvicorn[standard]
# python-dotenv
# google-genai
COPY requirements.txt .

# 4. Cài đặt dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 5. Copy toàn bộ source code vào container
COPY . .

# 6. Set biến môi trường cho Python (log sẽ xuất thẳng ra console)
ENV PYTHONUNBUFFERED=1

# 7. Expose port quiz-generator
EXPOSE 8001

# 8. Lệnh chạy server FastAPI
CMD ["uvicorn", "quiz_generator:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
