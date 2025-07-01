package com.pickle.backend.dto;

public class ScheduleDTO {
    private String schedule;
    private boolean status;

    public ScheduleDTO(String schedule, boolean status) {
        this.schedule = schedule;
        this.status = status;
    }

    public boolean isStatus() {
        return status;
    }

    public String getSchedule() {
        return schedule;
    }
    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }
    public void setStatus(boolean status) {
        this.status = status;
    }
}
