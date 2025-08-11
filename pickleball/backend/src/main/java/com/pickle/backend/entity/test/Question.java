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

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options;
    public void setContent(String content){
        this.content = content;
    }

    public void setOptions(List<Option> options){
        this.options = options;
    }

    public List<Option> getOptions(){
        return options;
    }

    public String getContent() {
        return content;
    }

    public Long getId() {
        return id;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
