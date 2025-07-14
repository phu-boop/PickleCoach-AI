package com.pickle.backend.dto;

import java.util.UUID;

public class CheckProgressRequestDTO {
    private UUID lessonId;
    private String learnerId;

    // Getters và Setters
    public UUID getLessonId() { return lessonId; }
    public void setLessonId(UUID lessonId) { this.lessonId = lessonId; }
    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }
}
