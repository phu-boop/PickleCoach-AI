package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.List;

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

    @NotBlank(message = "Pose data is mandatory")
    @Column(name = "poseData", columnDefinition = "JSON")
    private String poseData;

    @NotEmpty(message = "Classified movements cannot be empty")
    @ElementCollection
    @Column(name = "classifiedMovements")
    private List<String> classifiedMovements;

    @Column(name = "analysisResult")
    private String analysisResult;
}