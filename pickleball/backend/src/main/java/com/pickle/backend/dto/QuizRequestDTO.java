package com.pickle.backend.dto;

public class QuizRequestDTO {
    private String learnerId; // Thay userId thành learnerId để phù hợp DB
    private String topic;
    private String level; // easy/medium/hard

    // Getters and Setters
    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}