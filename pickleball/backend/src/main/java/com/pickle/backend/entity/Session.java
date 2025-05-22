package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
public class Session {
    @Id
    @Column(name = "sessionId", nullable = false)
    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "coachId")
    private Coach coach;

    @ManyToOne
    @JoinColumn(name = "learnerId")
    private Learner learner;

    @Column(name = "datetime")
    private LocalDateTime datetime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "videoLink")
    private String videoLink;

    @Column(name = "feedback")
    private String feedback;

    public enum Status {
        scheduled, in_progress, completed, cancelled
    }
}
