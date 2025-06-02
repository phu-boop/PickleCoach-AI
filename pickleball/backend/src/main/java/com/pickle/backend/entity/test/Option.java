package com.pickle.backend.entity.test;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

@Entity
public class Option {
    @Id
    @GeneratedValue
    private Long id;

    private String content;
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
}