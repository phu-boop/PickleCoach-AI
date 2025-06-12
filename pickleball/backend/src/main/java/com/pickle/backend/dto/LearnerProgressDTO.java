package com.pickle.backend.dto;

// DTO for updating learner progress
public class LearnerProgressDTO {
    private Long learnerId;
    private Long lessonId;
    private Boolean isCompleted;
    private Integer watchedDurationSeconds;

    // Getters and Setters
    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }
    public Long getLessonId() { return lessonId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
    public Integer getWatchedDurationSeconds() { return watchedDurationSeconds; }
    public void setWatchedDurationSeconds(Integer watchedDurationSeconds) { this.watchedDurationSeconds = watchedDurationSeconds; }
}
