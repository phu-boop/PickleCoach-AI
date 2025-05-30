# PickleCoach-AI 🚀

## Tài liệu học Spring Boot
📚 [Học cách tạo REST API với Spring Boot](https://www.geeksforgeeks.org/how-to-create-a-rest-api-using-java-spring-boot/) - Tài liệu hữu ích để làm quen với backend của dự án.

## Phần 1: Xác định mục tiêu và yêu cầu của đề tài 🎯

### 1.1 Mục đích 🌟
Cung cấp nền tảng học Pickleball với:
- **Chương trình học có cấu trúc**: Hướng dẫn bài bản từ cơ bản đến nâng cao.
- **Phân tích kỹ thuật bằng AI**: Đánh giá tư thế, cú đánh thông minh.
- **Kết nối huấn luyện viên cá nhân**: Hỗ trợ trực tuyến/trực tiếp.
- **Xây dựng cộng đồng người học năng động**: Giao lưu, kết nối người chơi.

---

### 1.2 Đối tượng người dùng 👥
- **Người học (Learner)**:
  - Mức độ: Người mới, trung cấp, nâng cao.
  - Nhu cầu: Tài liệu học tập, phân tích kỹ thuật AI, huấn luyện cá nhân, giao lưu cộng đồng.
- **Huấn luyện viên (Coach)**:
  - Chức năng: Tạo hồ sơ cá nhân, quản lý lịch dạy, theo dõi học viên, nhận thanh toán.
- **Quản trị viên (Admin)**:
  - Chức năng: Quản lý hệ thống, xác minh người dùng và huấn luyện viên, kiểm duyệt nội dung, báo cáo thống kê.

---

### 1.3 Yêu cầu chức năng ⚙️

#### 📱 Ứng dụng cho Người học (Learner App)
- Đăng ký tài khoản, đánh giá kỹ năng đầu vào.
- Truy cập chương trình học, video hướng dẫn, tìm kiếm nội dung.
- Phân tích kỹ thuật AI (góc quay video tư thế, phân loại cú đánh).
- Tìm và đặt lịch huấn luyện viên (online/offline).
- Gọi video (WebRTC), đánh giá buổi học, lịch sử huấn luyện.
- Theo dõi tiến độ học tập, nhận huy hiệu thành tích.
- Kết nối đối tác luyện tập, tham gia sự kiện, thanh toán tích hợp.

#### 🧑‍🏫 Ứng dụng cho Huấn luyện viên (Coach App)
- Tạo và xác minh hồ sơ huấn luyện viên.
- Quản lý lịch dạy, lên lịch buổi học.
- Theo dõi tiến độ học viên, gửi bài tập, nhận xét.
- Gọi video trực tiếp, nhận thanh toán, phân tích hiệu suất học viên.

#### 🛠️ Cổng quản trị viên (Admin Portal)
- Quản lý người dùng, xác minh huấn luyện viên.
- Quản lý nội dung học tập và kiểm duyệt.
- Thống kê, báo cáo, cấu hình hệ thống.

#### 🤖 AI & Phân tích kỹ thuật
- Phân tích tư thế người chơi từ video (sử dụng OpenCV + TensorFlow).
- Phân loại cú đánh (forehand, backhand, volley, serve, v.v.).
- Gợi ý nội dung cá nhân hóa theo kỹ năng và lịch sử học.

##Quy trình phát triển

🚀 GIAI ĐOẠN 1: CƠ SỞ HẠ TẦNG & CHỨC NĂNG CỐT LÕI

🔧 1. Thiết lập hệ thống
	•	Backend: Spring Boot + MySQL
	•	Frontend: React.js (Web), React Native (Mobile Learner & Coach Apps)
	•	AI server: Python (TensorFlow + OpenCV)
	•	Realtime: WebRTC (video call), WebSocket (thông báo)
	•	Authentication: JWT + OAuth2

⸻

👤 2. Chức năng Người học (Learner App)
	•	Đăng ký / đăng nhập, xác thực email
	•	Đánh giá kỹ năng đầu vào (form hoặc video)
	•	Xem chương trình học và video hướng dẫn
	•	Tìm kiếm nội dung
	•	Theo dõi tiến độ học
	•	Nhận huy hiệu thành tích

⸻

🧑‍🏫 3. Chức năng Huấn luyện viên (Coach App)
	•	Tạo và xác minh hồ sơ huấn luyện viên
	•	Quản lý lịch dạy, đặt buổi học
	•	Gửi bài tập, nhận xét học viên
	•	Gọi video trực tiếp (WebRTC)
	•	Nhận thanh toán (Stripe / PayPal)
	•	Xem thống kê hiệu suất học viên

⸻

🛠️ 4. Portal Quản trị viên (Admin)
	•	Đăng nhập admin
	•	Xác minh huấn luyện viên
	•	Kiểm duyệt nội dung bài học / video
	•	Quản lý người dùng
	•	Báo cáo, thống kê hệ thống

⸻

🤖 GIAI ĐOẠN 2: AI & PHÂN TÍCH KỸ THUẬT

📹 5. Phân tích video bằng AI
	•	Upload video từ Learner
	•	OpenCV: tách khung hình, phát hiện dáng người
	•	TensorFlow: phân loại tư thế, cú đánh (forehand, backhand, serve…)
	•	Trả kết quả phân tích cho học viên & huấn luyện viên

⸻

📊 6. Gợi ý nội dung học cá nhân hóa
	•	Xây dựng hệ thống đánh giá kỹ năng
	•	Phân tích lịch sử học tập
	•	Gợi ý bài học phù hợp theo trình độ

⸻

🌐 GIAI ĐOẠN 3: TÍNH NĂNG MỞ RỘNG

👥 7. Cộng đồng người học
	•	Tìm bạn luyện tập gần vị trí (Map API)
	•	Tạo và tham gia sự kiện
	•	Tương tác xã hội (bình luận, theo dõi người chơi khác)

⸻

💳 8. Thanh toán & Đặt lịch
	•	Chọn huấn luyện viên
	•	Xem thời gian trống
	•	Đặt lịch và thanh toán
