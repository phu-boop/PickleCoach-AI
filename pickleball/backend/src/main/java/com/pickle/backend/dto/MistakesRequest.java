package com.pickle.backend.dto;

import com.pickle.backend.entity.Mistakes;

public class MistakesRequest {

    private String title;
    private String description;
    private Mistakes.Status status;
    private String userId;

    public MistakesRequest() {}

    public MistakesRequest(String title, String description, Mistakes.Status status, String userId) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Mistakes.Status getStatus() {
        return status;
    }

    public void setStatus(Mistakes.Status status) {
        this.status = status;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}