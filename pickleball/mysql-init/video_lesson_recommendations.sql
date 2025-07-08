-- Tạo bảng video_lesson_recommendations để lưu trữ bài học đề xuất từ video analysis
CREATE TABLE IF NOT EXISTS video_lesson_recommendations (
    id CHAR(36) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    video_analysis_id VARCHAR(255),
    skill_level VARCHAR(50),
    weakest_shots TEXT,
    recommended_lesson_ids TEXT,
    average_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Thêm sample data nếu cần
-- INSERT INTO video_lesson_recommendations (id, user_id, skill_level, weakest_shots, recommended_lesson_ids, average_score) 
-- VALUES (UUID(), 'sample_user_id', 'Intermediate', '["forehand", "backhand"]', '["lesson_id_1", "lesson_id_2"]', 75.5);
