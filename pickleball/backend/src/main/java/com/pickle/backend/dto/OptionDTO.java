package com.pickle.backend.dto;

public class OptionDTO {
    private Long optionId;
    private String text;
    private boolean isCorrect;

    public OptionDTO() {}

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public Long getOptionId() {
        return optionId;
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
