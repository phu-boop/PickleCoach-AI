-- Chọn database
USE pickleball_db;

-- Tạo bảng users
CREATE TABLE users (
    userId UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('learner', 'coach', 'admin') NOT NULL
);

-- Tạo bảng coaches
CREATE TABLE coaches (
    userId UUID PRIMARY KEY,
    certifications TEXT,
    availability DATETIME,
    specialties TEXT, -- Lưu danh sách dưới dạng chuỗi (có thể chuyển thành JSON hoặc bảng riêng)
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- Tạo bảng learners
CREATE TABLE learners (
    userId UUID PRIMARY KEY,
    skillLevel VARCHAR(50),
    goals TEXT,
    progress TEXT, -- Lưu ProgressData dưới dạng chuỗi (có thể chuyển thành JSON)
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- Tạo bảng sessions
CREATE TABLE sessions (
    sessionId UUID PRIMARY KEY,
    coachId UUID NOT NULL,
    learnerId UUID NOT NULL,
    dateTime DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') NOT NULL,
    videoLink VARCHAR(255),
    feedback TEXT,
    FOREIGN KEY (coachId) REFERENCES coaches(userId),
    FOREIGN KEY (learnerId) REFERENCES learners(userId)
);

-- Tạo bảng video_analyses
CREATE TABLE video_analyses (
    videoId UUID PRIMARY KEY,
    learnerId UUID NOT NULL,
    poseData TEXT, -- Lưu JSON dưới dạng chuỗi
    classifiedMovements TEXT, -- Lưu danh sách dưới dạng chuỗi (có thể chuyển thành JSON hoặc bảng riêng)
    analysisResult TEXT,
    FOREIGN KEY (learnerId) REFERENCES learners(userId)
);

-- Tạo bảng payments
CREATE TABLE payments (
    paymentId UUID PRIMARY KEY,
    userId UUID NOT NULL,
    amount FLOAT NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL,
    method ENUM('credit_card', 'paypal', 'bank_transfer') NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- Thêm dữ liệu mẫu
-- Users
INSERT INTO users (user_id, name, email, password, role) 
VALUES (UUID(), 'Admin User', 'admin@example.com', 'admin123', 'admin'),
       (UUID(), 'Coach User', 'coach@example.com', 'coach123', 'coach'),
       (UUID(), 'Learner User', 'learner@example.com', 'learner123', 'learner');

-- Coaches
INSERT INTO coaches (userId, certifications, availability, specialties)
SELECT userId, 'Certified Coach Level 1', '2025-05-23 09:00:00', '["forehand", "backhand"]'
FROM users WHERE email = 'coach@example.com';

-- Learners
INSERT INTO learners (userId, skillLevel, goals, progress)
SELECT userId, 'Beginner', 'Improve forehand', '{"level": 1, "completedTasks": 2}'
FROM users WHERE email = 'learner@example.com';

-- Sessions
INSERT INTO sessions (sessionId, coachId, learnerId, dateTime, status, videoLink, feedback)
SELECT UUID(), c.userId, l.userId, '2025-05-23 10:00:00', 'scheduled', 'http://example.com/video', 'Good session'
FROM coaches c
JOIN learners l ON 1=1
WHERE c.userId = (SELECT userId FROM users WHERE email = 'coach@example.com')
AND l.userId = (SELECT userId FROM users WHERE email = 'learner@example.com');

-- Video Analyses
INSERT INTO video_analyses (videoId, learnerId, poseData, classifiedMovements, analysisResult)
SELECT UUID(), userId, '{"keypoints": [1, 2, 3]}', '["swing", "step"]', 'Needs improvement in swing'
FROM learners
WHERE userId = (SELECT userId FROM users WHERE email = 'learner@example.com');

-- Payments
INSERT INTO payments (paymentId, userId, amount, status, method)
SELECT UUID(), userId, 50.0, 'completed', 'credit_card'
FROM users WHERE email = 'learner@example.com';