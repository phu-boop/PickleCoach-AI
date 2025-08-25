# Sử dụng Python 3.10 làm image cơ sở
# Đây là phiên bản tương thích với các gói đã cài đặt trước đó
FROM python:3.10

# Đặt thư mục làm việc bên trong container là /app
WORKDIR /app

# Cài đặt các gói hệ thống cần thiết, bao gồm ffmpeg để xử lý video
# và git để cài đặt một số thư viện từ GitHub nếu cần.
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Sao chép file requirements.txt vào thư mục làm việc
# Lệnh này giúp Docker cache lớp này, nên khi chỉ có code thay đổi,
# Docker không phải cài lại tất cả các thư viện.
COPY requirements.txt ./

# Cài đặt các thư viện Python từ requirements.txt
# --no-cache-dir để tránh lưu cache pip, tiết kiệm dung lượng
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Tạo thư mục 'data' để lưu trữ các video tải lên
# Thư mục này sẽ được gắn với volume trong docker-compose.yml
RUN mkdir -p data

# Mở cổng 8000 để ứng dụng có thể truy cập được từ bên ngoài container
EXPOSE 8000

# Đặt lệnh mặc định để chạy ứng dụng
# uvicorn main:app sẽ chạy ứng dụng, --host 0.0.0.0 để ứng dụng
# có thể truy cập được từ bên ngoài container, không chỉ localhost.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
