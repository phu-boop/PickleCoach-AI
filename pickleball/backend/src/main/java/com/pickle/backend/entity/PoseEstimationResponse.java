package com.pickle.backend.entity;

import lombok.Data;

@Data
public class PoseEstimationResponse {
    private String poseData;
    private String classifiedMovements;
    private String analysisResult;
    private String recommendations;
}