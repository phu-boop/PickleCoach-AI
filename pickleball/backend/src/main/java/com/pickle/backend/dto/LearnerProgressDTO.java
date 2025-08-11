package com.pickle.backend.dto;

import java.util.UUID;

// DTO for updating learner progress
public class LearnerProgressDTO {
    private String learnerId;
    private UUID lessonId;
    private Boolean isCompleted;
    private Integer watchedDurationSeconds;

    // Getters and Setters
    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }
    public UUID getLessonId() { return lessonId; }
    public void setLessonId(UUID lessonId) { this.lessonId = lessonId; }
    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
    public Integer getWatchedDurationSeconds() { return watchedDurationSeconds; }
    public void setWatchedDurationSeconds(Integer watchedDurationSeconds) { this.watchedDurationSeconds = watchedDurationSeconds; }
}
