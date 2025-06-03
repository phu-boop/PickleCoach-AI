package com.pickle.backend.ai.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "movement_classification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovementClassification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "User ID is mandatory")
    @Column(name = "user_id", nullable = false)
    private String userId;

    @NotBlank(message = "Video URL is mandatory")
    @Column(name = "video_url")
    private String videoUrl;

    @NotBlank(message = "Label is mandatory")
    @Column(name = "label")
    private String label;
}