package com.pickle.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class QuizResponseDTO {
    @JsonProperty("questions")
    private List<QuizQuestionDTO> questions;

    @JsonProperty("topic")
    private String topic;

    @JsonProperty("level")
    private String level;

    @JsonProperty("learner_analysis")
    private Map<String, Object> learnerAnalysis; // Thông tin phân tích từ AI
}