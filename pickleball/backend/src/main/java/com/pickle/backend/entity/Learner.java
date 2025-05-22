package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "learners")
@Getter
@Setter
@NoArgsConstructor
public class Learner {
    @Id
    @Column(name = "userId", nullable = false)
    private String userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "userId")
    private User user;

    @Column(name = "skillLevel")
    private String skillLevel;

    @Column(name = "goals")
    private String goals;

    @Embedded
    private ProgressData progress;
}

@Embeddable
@Getter
@Setter
@NoArgsConstructor
class ProgressData {
    private int lessonsCompleted;
    private double accuracyScore;
    // Thêm các trường khác nếu cần
}
