package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    @Column(name = "sessionId", nullable = false)
    private String sessionId;

    @NotNull(message = "Coach is mandatory")
    @ManyToOne
    @JoinColumn(name = "coachId")
    private Coach coach;

    @NotNull(message = "Learner is mandatory")
    @ManyToOne
    @JoinColumn(name = "learnerId")
    private Learner learner;

    @NotNull(message = "Datetime is mandatory")
    @Column(name = "datetime")
    private LocalDateTime datetime;

    @NotNull(message = "Status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "videoLink")
    private String videoLink;

    @Column(name = "feedback")
    private String feedback;

    public enum Status {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}