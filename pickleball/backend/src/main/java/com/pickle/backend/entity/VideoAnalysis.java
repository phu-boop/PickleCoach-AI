package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "video_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VideoAnalysis {

    @Id
    @Column(name = "video_id", nullable = false)
    private String videoId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "detailed_feedbacks", columnDefinition = "LONGTEXT")
    private String detailedFeedbacks;

    @Column(name = "shot_analysis", columnDefinition = "LONGTEXT")
    private String shotAnalysis;

    @Column(name = "analysis_result", columnDefinition = "LONGTEXT")
    private String analysisResult;

    @Column(name = "recommendations", columnDefinition = "LONGTEXT")
    private String recommendations;

    @Column(name = "video_path")
    private String videoPath;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "userId", insertable = false, updatable = false)
    private Learner learner;
}