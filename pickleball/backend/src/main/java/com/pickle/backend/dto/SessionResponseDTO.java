package com.pickle.backend.dto;

import com.pickle.backend.entity.Session;
import java.time.LocalDateTime;

public class SessionResponseDTO {
    private String sessionId;
    private String coachId;
    private String learnerId;
    private LocalDateTime datetime;
    private Session.Status status;
    private String videoLink;
    private String feedback;

    // Constructor từ Session entity
    public SessionResponseDTO(Session session) {
        this.sessionId = session.getSessionId();
        this.coachId = session.getCoach().getUserId();
        this.learnerId = session.getLearner().getUserId();
        this.datetime = session.getDatetime();
        this.status = session.getStatus();
        this.videoLink = session.getVideoLink();
        this.feedback = session.getFeedback();
    }

    // Getters và Setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getCoachId() { return coachId; }
    public void setCoachId(String coachId) { this.coachId = coachId; }
    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }
    public LocalDateTime getDatetime() { return datetime; }
    public void setDatetime(LocalDateTime datetime) { this.datetime = datetime; }
    public Session.Status getStatus() { return status; }
    public void setStatus(Session.Status status) { this.status = status; }
    public String getVideoLink() { return videoLink; }
    public void setVideoLink(String videoLink) { this.videoLink = videoLink; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}