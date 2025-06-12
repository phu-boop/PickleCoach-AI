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

    @Column(name = "learner_id", nullable = false)
    private String learnerId;

    @Column(name = "pose_data", columnDefinition = "LONGTEXT")
    private String poseData;

    @Column(name = "classified_movements", columnDefinition = "LONGTEXT")
    private String classifiedMovements;

    @Column(name = "analysis_result", columnDefinition = "LONGTEXT")
    private String analysisResult;

    @Column(name = "recommendations", columnDefinition = "LONGTEXT")
    private String recommendations;

    @Column(name = "video_path")
    private String videoPath;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learner_id", referencedColumnName = "userId", insertable = false, updatable = false)
    private Learner learner;
}