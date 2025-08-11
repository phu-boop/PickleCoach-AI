package com.pickle.backend.dto;

public class OptionDTO {
    private Long optionId;
    private Long id;  // Added for compatibility
    private String text;
    private boolean isCorrect;

    public OptionDTO() {}

    // Original methods
    public void setOptionId(Long optionId) {
        this.optionId = optionId;
        this.id = optionId; // Keep them in sync
    }

    public Long getOptionId() {
        return optionId;
    }

    // Added missing setId/getId methods
    public void setId(Long id) {
        this.id = id;
        this.optionId = id; // Keep them in sync
    }

    public Long getId() {
        return this.id != null ? this.id : this.optionId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}