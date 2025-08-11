package com.pickle.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_results")
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "learner_id", nullable = false)
    private String learnerId;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "selected_option_text", nullable = false)
    private String selectedOptionText;

    @Column(name = "correct_option_text", nullable = false)
    private String correctOptionText;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "topic")
    private String topic;

    @Column(name = "level")
    private String level;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLearnerId() { return learnerId; }
    public void setLearnerId(String learnerId) { this.learnerId = learnerId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getSelectedOptionText() { return selectedOptionText; }
    public void setSelectedOptionText(String selectedOptionText) { this.selectedOptionText = selectedOptionText; }

    public String getCorrectOptionText() { return correctOptionText; }
    public void setCorrectOptionText(String correctOptionText) { this.correctOptionText = correctOptionText; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}