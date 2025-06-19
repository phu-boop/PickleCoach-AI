package com.pickle.backend.dto;

public class CheckProgressResponseDTO {
    private boolean isExist;
    private String message;
    private long IdProgress;

    public void setIdProgress(long idProgress) {
        IdProgress = idProgress;
    }

    public long getIdProgress() {
        return IdProgress;
    }

    // Constructor
    public CheckProgressResponseDTO(boolean isExist, String message,long IdProgress) {
        this.isExist = isExist;
        this.message = message;
        this.IdProgress = IdProgress;
    }

    // Getters và Setters
    public boolean getIsExist() {
        return isExist;
    }

    public void setIsExist(boolean isExist) {
        this.isExist = isExist;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}