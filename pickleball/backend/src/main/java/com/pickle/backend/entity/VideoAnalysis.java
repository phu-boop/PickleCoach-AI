package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "video_analyses")
@Getter
@Setter
@NoArgsConstructor
public class VideoAnalysis {
    @Id
    @Column(name = "videoId", nullable = false)
    private String videoId;

    @ManyToOne
    @JoinColumn(name = "learnerId")
    private Learner learner;

    @Column(name = "poseData", columnDefinition = "JSON")
    private String poseData;

    @ElementCollection
    @Column(name = "classifiedMovements")
    private List<String> classifiedMovements;

    @Column(name = "analysisResult")
    private String analysisResult;
}