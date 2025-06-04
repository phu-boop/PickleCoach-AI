package com.pickle.backend.dto;

public class OptionDTO {
    private String text;
    private boolean isCorrect;

    public OptionDTO() {}

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
