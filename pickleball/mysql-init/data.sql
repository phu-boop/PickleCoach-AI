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

-- Cập nhật bảng users
ALTER TABLE users (
    userId VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    skill_level VARCHAR(50),
    preferences TEXT
);

-- Tạo bảng pose_analysis
CREATE TABLE pose_analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    feedback TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(userId)
);

-- Tạo bảng movement_classification
CREATE TABLE movement_classification (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    label VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(userId)
);

-- Tạo bảng content
CREATE TABLE content (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tags TEXT NOT NULL,
    url TEXT NOT NULL
);

INSERT INTO users (userId, name, email, password, role, skill_level, preferences)
VALUES ('abc123', 'Test User', 'test@example.com', 'password', 'user', 'beginner', 'forehand,serve');

INSERT INTO content (id, title, tags, url)
VALUES (1, 'Hướng dẫn forehand', 'forehand,beginner', 'https://example.com/video1');