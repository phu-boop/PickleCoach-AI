package com.pickle.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class QuizQuestionDTO {
    @JsonProperty("question_text")
    private String questionText;

    @JsonProperty("options")
    private List<QuizOptionDTO> options; // Sửa từ OptionDTO thành QuizOptionDTO

    @JsonProperty("explanation")
    private String explanation;

    // helper: trả về index của option đúng (0-based) hoặc -1 nếu không có
    public int getCorrectAnswer() {
        if (options == null) return -1;
        for (int i = 0; i < options.size(); i++) {
            if (options.get(i).isCorrect()) {
                return i;
            }
        }
        return -1;
    }
}