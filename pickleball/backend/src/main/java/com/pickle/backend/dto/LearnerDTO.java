package com.pickle.backend.dto;

import java.util.List;

public class LearnerDTO {
    private String id;
    private String skillLevel;
    private List<String> goals;
    private String progress;

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }
    public String getProgress() {
        return progress;
    }

    public List<String> getGoals() {
        return goals;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public String getId() {
        return id;
    }

}
