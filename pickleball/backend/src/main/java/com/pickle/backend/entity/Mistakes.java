package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mistakes")
@Data
@NoArgsConstructor
public class Mistakes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum Status {
        OPEN,
        IN_PROGRESS,
        CLOSED
    }

    public Mistakes(String title, String description, Status status, User user) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.user = user;
    }
}