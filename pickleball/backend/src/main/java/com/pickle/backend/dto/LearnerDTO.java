package com.pickle.backend.dto;

import java.util.List;

public class LearnerDTO {
    private String id;
    private String skillLevel;
    private String goals;
    private String progress;
    private String userName;

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGoals(String goals) {
        this.goals = goals;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }
    public String getProgress() {
        return progress;
    }

    public String getGoals() {
        return goals;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public String getId() {
        return id;
    }


}
