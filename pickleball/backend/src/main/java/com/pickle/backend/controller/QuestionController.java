package com.pickle.backend.controller;

import com.pickle.backend.dto.AnswerDTO;
import com.pickle.backend.entity.test.Option;
import com.pickle.backend.entity.test.Question;
import com.pickle.backend.repository.OptionRepository;
import com.pickle.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private OptionRepository optionRepo;

    @GetMapping("/quiz")
    public List<Question> getQuiz() {
        Pageable pageable = PageRequest.of(0, 10); // Ví dụ: Lấy 10 câu hỏi ngẫu nhiên
        return questionRepo.findRandomQuestions((java.awt.print.Pageable) pageable);
    }

    @PostMapping("/submit")
    public int submitQuiz(@RequestBody List<AnswerDTO> answers) {
        int score = 0;
        for (AnswerDTO answer : answers) {
            Optional<Option> selected = optionRepo.findById(answer.getOptionId());
            if (selected.isPresent() && selected.get().isCorrect()) {
                score++;
            }
        }
        return score;
    }
}
