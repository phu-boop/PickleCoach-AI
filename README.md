# 🏓 PickleCoach-AI

Nền tảng học Pickleball ứng dụng trí tuệ nhân tạo (AI) và video call hỗ trợ kết nối huấn luyện viên trực tuyến. Hệ thống hỗ trợ Learner, Coach và Admin với giao diện riêng biệt.

![trang chủ](https://raw.githubusercontent.com/phu-boop/PickleCoach-AI/refs/heads/main/pickleball/frontend/src/assets/images/Screenshot%202025-07-15%20144318.png)

## 🚀 Tính năng nổi bật

### 👨‍🎓 Learner App
- Đăng ký, đánh giá kỹ năng đầu vào
- Truy cập chương trình học & video hướng dẫn
- Phân tích kỹ thuật AI (góc đánh, tư thế)
- Đặt lịch huấn luyện viên (online/offline)
- Gọi video với huấn luyện viên (WebRTC)
- Theo dõi tiến độ, nhận huy hiệu, giao lưu cộng đồng

### 🧑‍🏫 Coach App
- Tạo & xác minh hồ sơ huấn luyện viên
- Quản lý lịch dạy & buổi học
- Gọi video trực tiếp với học viên
- Theo dõi tiến độ học tập, gửi bài tập
- Nhận thanh toán trực tuyến

### 🛠️ Admin Portal
- Xác minh người dùng & huấn luyện viên
- Quản lý nội dung học tập
- Kiểm duyệt video, thống kê & cấu hình hệ thống

### 🤖 AI Phân Tích Kỹ Thuật
- Upload video -> phân tích tư thế bằng OpenCV + TensorFlow
- Phân loại các cú đánh: forehand, backhand, serve, volley...
- Gợi ý nội dung học cá nhân hóa theo kỹ năng

---

## 🧱 Kiến trúc hệ thống

| Thành phần       | Công nghệ sử dụng       |
|------------------|-------------------------|
| Frontend Web     | React.js + Tailwind CSS |
| Backend API      | Spring Boot (Java)      |
| Database         | MySQL                   |
| Realtime         | WebRTC, WebSocket       |
| AI Processing    | Python, OpenCV, TensorFlow |
| Auth             | JWT + OAuth2            |
| Deploy           | Docker                  |

---

## 🐳 Cách chạy bằng Docker

> **Yêu cầu:** Cài sẵn Docker & Docker Compose

### 1. Clone project
git clone https://github.com/ten-ban/PickleCoach-AI.git
cd PickleCoach-AI
2. Cấu hình .env
Tạo file .env trong thư mục backend/ và frontend/ nếu cần. Ví dụ:

backend/.env

3. Build và chạy Docker
bash
Copy
Edit
docker-compose up --build
4. Truy cập
Frontend: http://localhost:3000

Backend API: http://localhost:8080

MySQL: localhost:3306 (bên trong Docker)
