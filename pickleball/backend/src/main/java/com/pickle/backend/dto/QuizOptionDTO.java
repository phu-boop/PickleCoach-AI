package com.pickle.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class QuizOptionDTO {
    @JsonProperty("id")
    private int id;

    @JsonProperty("text")
    private String text;

    // map JSON "is_correct" -> boolean correct (getter will be isCorrect())
    @JsonProperty("is_correct")
    private boolean correct;

    // optional explicit getter (safe)
    public boolean isCorrect() {
        return correct;
    }
}
