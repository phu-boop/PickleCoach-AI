package com.pickle.backend.entity;

import jakarta.persistence.*;
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
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    @Column(name = "skillLevel")
    private String skillLevel;

    @ElementCollection
    @CollectionTable(name = "learner_goals", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "goal")
    private List<String> goals;

    @Column(name = "progress")
    private String progress;
}