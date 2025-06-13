package com.pickle.backend.entity.curriculum;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private Module module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    private LevelRequired level;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_type")
    private SkillType skillType;

    @Column(name = "order_in_module")
    private Integer orderInModule;

    @Column(name = "order_in_course")
    private Integer orderInCourse;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(name = "is_premium")
    private Boolean isPremium;

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

    public enum LevelRequired {
        BEGINNER, INTERMEDIATE, ADVANCED
    }

    public enum SkillType {
        FOREHAND, BACKHAND, SERVE, DINK
    }
}
