package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "learners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Learner {
    @Id
    @Column(name = "userId", nullable = false)
    private String userId;

    @NotNull(message = "User is mandatory")
    @OneToOne
    @MapsId
    @JoinColumn(name = "userId")
    private User user;

    @NotEmpty(message = "Skill level cannot be empty")
    @Column(name = "skillLevel")
    private String skillLevel;

    @NotEmpty(message = "Goals cannot be empty")
    @ElementCollection
    @Column(name = "goals")
    private List<String> goals;

    @Column(name = "progress")
    private String progress;
}