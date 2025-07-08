-- Cập nhật thumbnail_url cho các lessons
UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop' WHERE skill_type = 'FOREHAND' AND thumbnail_url IS NULL;

UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' WHERE skill_type = 'BACKHAND' AND thumbnail_url IS NULL;

UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop' WHERE skill_type = 'SERVE' AND thumbnail_url IS NULL;

UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop' WHERE skill_type = 'DINK' AND thumbnail_url IS NULL;

UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=300&h=200&fit=crop' WHERE skill_type = 'GRIP' AND thumbnail_url IS NULL;

UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' WHERE skill_type = 'BALANCE' AND thumbnail_url IS NULL;

-- Cập nhật cho các lessons không có skill_type cụ thể
UPDATE lessons SET thumbnail_url = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop' WHERE thumbnail_url IS NULL;

-- Thêm sample lessons với hình ảnh nếu chưa có
INSERT IGNORE INTO lessons (id, title, description, video_url, duration_seconds, thumbnail_url, level, skill_type, course_id, order_in_course, is_premium, created_at, updated_at)
VALUES 
(UUID(), 'Kỹ thuật Forehand cơ bản', 'Học cách thực hiện cú forehand chuẩn trong pickleball', 'https://www.youtube.com/watch?v=example1', 600, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop', 'BEGINNER', 'FOREHAND', 1, 1, FALSE, NOW(), NOW()),

(UUID(), 'Kỹ thuật Backhand hiệu quả', 'Nắm vững kỹ thuật backhand để cải thiện lối chơi', 'https://www.youtube.com/watch?v=example2', 480, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', 'BEGINNER', 'BACKHAND', 1, 2, FALSE, NOW(), NOW()),

(UUID(), 'Serve mạnh mẽ và chính xác', 'Học cách serve hiệu quả trong pickleball', 'https://www.youtube.com/watch?v=example3', 720, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop', 'INTERMEDIATE', 'SERVE', 1, 3, FALSE, NOW(), NOW()),

(UUID(), 'Kỹ thuật Dink nâng cao', 'Làm chủ kỹ thuật dink để kiểm soát trận đấu', 'https://www.youtube.com/watch?v=example4', 540, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop', 'INTERMEDIATE', 'DINK', 1, 4, TRUE, NOW(), NOW()),

(UUID(), 'Cách cầm vợt đúng cách', 'Học cách cầm vợt để tối ưu hóa hiệu suất', 'https://www.youtube.com/watch?v=example5', 360, 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=300&h=200&fit=crop', 'BEGINNER', 'GRIP', 1, 5, FALSE, NOW(), NOW()),

(UUID(), 'Cân bằng và di chuyển', 'Phát triển sự cân bằng và kỹ năng di chuyển', 'https://www.youtube.com/watch?v=example6', 900, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', 'ADVANCED', 'BALANCE', 1, 6, TRUE, NOW(), NOW());
