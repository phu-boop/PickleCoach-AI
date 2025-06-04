package com.pickle.backend.controller;

import com.pickle.backend.entity.test.Options;
import com.pickle.backend.entity.test.Question;
import com.pickle.backend.repository.OptionRepository;
import com.pickle.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private OptionRepository optionRepo;

    @GetMapping("/options")
    public List<Options> getAllOptions() {
        return optionRepo.findAll();
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepo.findAll();
    }

//    @GetMapping("/quiz")
//    public List<Question> getQuiz() {
//        return questionRepo.findRandomQuestions();
//    }

//    @PostMapping("/submit")
//    public int submitQuiz(@RequestBody List<AnswerDTO> answers) {
//        int score = 0;
//        for (AnswerDTO answer : answers) {
//            Optional<Option> selected = optionRepo.findById(answer.getOptionId());
//            if (selected.isPresent() && selected.get().isCorrect()) {
//                score++;
//            }
//        }
//        return score;
//    }
}
