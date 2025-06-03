package com.pickle.backend.entity.test;
import jakarta.persistence.*;
import java.util.List;
@Entity
public class Question {
    @Id
    @GeneratedValue
    private Long id;

    private String content;
    private String level; // EASY, MEDIUM, HARD

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Options> options;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
