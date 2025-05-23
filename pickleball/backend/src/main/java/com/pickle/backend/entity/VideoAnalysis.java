package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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
    @Column(name = "videoId", nullable = false)
    private String videoId;

    @NotNull(message = "Learner is mandatory")
    @ManyToOne
    @JoinColumn(name = "learnerId")
    private Learner learner;

    @Column(name = "poseData")
    private String poseData;

    @Column(name = "classifiedMovements")
    private String classifiedMovements;

    @Column(name = "analysisResult")
    private String analysisResult;
}