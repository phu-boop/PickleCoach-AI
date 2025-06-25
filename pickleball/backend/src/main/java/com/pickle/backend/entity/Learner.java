package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;


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
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    @MapsId
    private User user;

    @Column(name = "skillLevel")
    private String skillLevel;

    @Column(name = "goals", columnDefinition = "text")
    private String goals;

    @Column(name = "progress")
    private String progress;

    public Learner(String userId, User user, String skillLevel, String goals) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.userId = user.getId(); // Đồng bộ userId từ User
        this.user = user;
        this.skillLevel = skillLevel;
        this.goals = goals;
    }
}