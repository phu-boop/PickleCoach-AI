package com.pickle.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pickle.backend.entity.Coach;
import java.util.List;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CoachDTO {
    private String urlAvata;
    private String userId;
    private String name;
    private String email;
    private String role;
    private List<String> certifications;
    private List<String> availability;
    private List<String> specialties;
    private Coach.Level level;
    public CoachDTO(Coach coach) {
        this.userId = coach.getUserId();
        this.name = coach.getUser().getName();
        this.email = coach.getUser().getEmail();
        this.certifications = coach.getCertifications();
        this.availability = coach.getAvailability();
        this.specialties = coach.getSpecialties();
        this.role = coach.getUser().getRole();
        this.urlAvata = coach.getUser().getUrlavata();
        this.level = coach.getLevel();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setCertifications(List<String> certifications) {
        this.certifications = certifications;
    }

    public void setAvailability(List<String> availability) {
        this.availability = availability;
    }

    public void setSpecialties(List<String> specialties) {
        this.specialties = specialties;
    }

    public void setLevel(Coach.Level level) {
        this.level = level;
    }

    public Coach.Level getLevel() {
        return level;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public List<String> getCertifications() {
        return certifications;
    }

    public List<String> getAvailability() {
        return availability;
    }

    public List<String> getSpecialties() {
        return specialties;
    }

    public String getUrlAvata() {
        return urlAvata;
    }

    public void setUrlAvata(String urlAvata) {
        this.urlAvata = urlAvata;
    }
}
