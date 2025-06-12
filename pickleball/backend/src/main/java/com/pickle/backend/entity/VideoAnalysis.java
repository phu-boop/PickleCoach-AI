package com.pickle.backend.entity;

import jakarta.persistence.*;
// import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "video_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VideoAnalysis {
    @Id
    @Column(columnDefinition = "uuid")
    private String videoId;

    @Column(nullable = false)
    private String learnerId;

    @Column(columnDefinition = "text")
    private String poseData;

    @Column(columnDefinition = "text")
    private String classifiedMovements;

    @Column(columnDefinition = "text")
    private String analysisResult;

    @Column(columnDefinition = "text")
    private String recommendations;

    @Column(updatable = false)
    private java.sql.Timestamp createdAt;

    // Nếu cần mối quan hệ với Learner
    // @ManyToOne
    // @JoinColumn(name = "learnerId", insertable = false, updatable = false)
    // private Learner learner;
}