package com.pickle.backend.dto;

import java.util.List;

public class QuestionDTO {
    private String content;
    private List<OptionDTO> options;
    public String getContent() {
        return content;
    }

    public List<OptionDTO> getOptions(){
        return options;
    }

}



