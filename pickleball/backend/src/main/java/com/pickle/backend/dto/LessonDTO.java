package com.pickle.backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class LessonDTO {
    private UUID id;
    private String title;
    private String description;
    private String videoUrl;
    private Integer durationSeconds;
    private String thumbnailUrl;
    private String skillType; // Đây là String trong DTO
    private String level;     // Đây là String trong DTO
    private Long courseId;
    private Long moduleId;
    private Integer orderInModule;
    private Integer orderInCourse;
    private String contentText;
    private Boolean isPremium;
}