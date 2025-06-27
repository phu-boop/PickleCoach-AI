package com.pickle.backend.dto;

import com.pickle.backend.entity.Coach;
import java.util.List;

public class CoachDTO {
    private String userId;
    private String name;
    private String email;
    private String role;
    private List<String> certifications;
    private List<String> availability;
    private List<String> specialties;

    public CoachDTO(Coach coach) {
        this.userId = coach.getUserId();
        this.name = coach.getUser().getName();
        this.email = coach.getUser().getEmail();
        this.certifications = coach.getCertifications();
        this.availability = coach.getAvailability();
        this.specialties = coach.getSpecialties();
        this.role = coach.getUser().getRole();
    }

    public String getUserId() {
        return userId;
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

}
