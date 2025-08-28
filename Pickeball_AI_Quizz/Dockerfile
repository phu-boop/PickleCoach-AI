# Dockerfile
FROM python:3.11-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép requirements và cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép mã nguồn
COPY quiz_generator.py .

# Thiết lập biến môi trường (có thể ghi đè khi chạy container)
ENV GEMINI_API_KEY="key-geinimi-ai"
ENV PYTHONPATH=/app

# Expose port 8001
EXPOSE 8001

# Chạy ứng dụng trên port 8001
CMD ["uvicorn", "quiz_generator:app", "--host", "0.0.0.0", "--port", "8001"]