package com.pickle.backend.entity.curriculum;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "video_lesson_recommendations")
@Data
public class VideoLessonRecommendation {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "video_analysis_id")
    private String videoAnalysisId;

    @Column(name = "skill_level")
    private String skillLevel;

    @Column(name = "weakest_shots", columnDefinition = "TEXT")
    private String weakestShots; // JSON string của danh sách weakest shots

    @Column(name = "recommended_lesson_ids", columnDefinition = "TEXT")
    private String recommendedLessonIds; // JSON string của danh sách lesson IDs

    @Column(name = "average_score")
    private Double averageScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
