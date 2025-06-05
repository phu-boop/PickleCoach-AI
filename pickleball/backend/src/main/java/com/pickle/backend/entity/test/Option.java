package com.pickle.backend.entity.test;

import com.pickle.backend.dto.OptionDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "question_options")
public class Option {
    @Id
    @GeneratedValue
    private Long id;

    private String content;
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    public boolean isCorrect(){
        return isCorrect;
    }
    public void setContent(String content){
        this.content = content;
    }
    public void setCorrect(boolean isCorrect){
        this.isCorrect = isCorrect;
    }
    public void setQuestion(Question question){
        this.question = question;
    }
}