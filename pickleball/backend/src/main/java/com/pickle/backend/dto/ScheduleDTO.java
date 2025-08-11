package com.pickle.backend.dto;

public class ScheduleDTO {
    private String id;
    private String schedule;
    private boolean status;
    private StatusSession statusSession;

    public enum StatusSession {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }


    public ScheduleDTO(String id, String schedule, boolean status, StatusSession statusSession) {
        this.id = id;
        this.schedule = schedule;
        this.status = status;
        this.statusSession = statusSession;
    }


    public ScheduleDTO(String schedule, boolean status, StatusSession statusSession) {
        this(null, schedule, status, statusSession);
    }


    public ScheduleDTO(String schedule, boolean status) {
        this(null, schedule, status, null);
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public StatusSession getStatusSession() {
        return statusSession;
    }

    public void setStatusSession(StatusSession statusSession) {
        this.statusSession = statusSession;
    }
}
