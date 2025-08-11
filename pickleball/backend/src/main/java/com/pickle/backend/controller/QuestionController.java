package com.pickle.backend.controller;

import com.pickle.backend.dto.*;
import com.pickle.backend.entity.QuizResult;
import com.pickle.backend.entity.test.Option;
import com.pickle.backend.entity.test.Question;
import com.pickle.backend.repository.OptionRepository;
import com.pickle.backend.repository.QuestionRepository;
import com.pickle.backend.repository.QuizResultsRepository;
import com.pickle.backend.service.QuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private static final Logger logger = LoggerFactory.getLogger(QuestionController.class);

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private OptionRepository optionRepo;

    @Autowired
    private QuizResultsRepository quizResultsRepository;

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public List<QuestionDTO> getAllQuestions() {
        logger.info("Received GET request for all questions");
        List<Question> questions = questionRepo.findAll();
        List<QuestionDTO> questionDTOs = questions.stream().map(question -> {
            List<OptionDTO> optionDTOs = question.getOptions().stream().map(option -> {
                OptionDTO optionDTO = new OptionDTO();
                optionDTO.setId(option.getId());
                optionDTO.setText(option.getText());
                optionDTO.setCorrect(option.isCorrect());
                return optionDTO;
            }).collect(Collectors.toList());

            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setId(question.getId());
            questionDTO.setContent(question.getContent());
            questionDTO.setLevel(question.getLevel());
            questionDTO.setOptions(optionDTOs);
            return questionDTO;
        }).collect(Collectors.toList());

        logger.info("Returning {} questions", questionDTOs.size());
        return questionDTOs;
    }

    @PostMapping
    public Question createQuestion(@RequestBody QuestionDTO dto) {
        logger.info("Received POST request to create question: {}", dto.getContent());
        Question question = new Question();
        question.setContent(dto.getContent());
        question.setLevel(dto.getLevel());

        Question savedQuestion = questionRepo.save(question);
        logger.info("Question created with ID: {}", savedQuestion.getId());
        return savedQuestion;
    }

    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        logger.info("Received PUT request to update question ID: {}", id);
        Optional<Question> optionalQuestion = questionRepo.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setContent(dto.getContent());
            question.setLevel(dto.getLevel());

            Question updatedQuestion = questionRepo.save(question);
            logger.info("Question updated with ID: {}", updatedQuestion.getId());
            return updatedQuestion;
        } else {
            logger.warn("Question with ID {} not found for update", id);
            throw new RuntimeException("Question not found");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        logger.info("Received DELETE request for question ID: {}", id);
        if (questionRepo.existsById(id)) {
            questionRepo.deleteById(id);
            logger.info("Question deleted with ID: {}", id);
        } else {
            logger.warn("Question with ID {} not found for deletion", id);
            throw new RuntimeException("Question not found");
        }
    }

    @GetMapping("/{id}")
    public Question getQuestion(@PathVariable Long id) {
        logger.info("Received GET request for question ID: {}", id);
        Optional<Question> question = questionRepo.findById(id);
        if (question.isPresent()) {
            logger.info("Question found with ID: {}", id);
            return question.get();
        } else {
            logger.warn("Question with ID {} not found", id);
            throw new RuntimeException("Question not found");
        }
    }

    @GetMapping("/quiz")
    public List<Question> getQuiz() {
        logger.info("Received GET request for random quiz questions");
        List<Question> questions = questionRepo.findRandomQuestions(PageRequest.of(0, 5));
        logger.info("Returning {} random questions for quiz", questions.size());
        return questions;
    }

    @PostMapping("/submit")
    public int submitQuiz(@RequestBody List<AnswerDTO> answers) {
        logger.info("Received POST request to submit quiz with {} answers", answers.size());
        int score = 0;
        for (AnswerDTO answer : answers) {
            Optional<Option> selected = optionRepo.findById(answer.getOptionId());
            if (selected.isPresent() && selected.get().isCorrect()) {
                score++;
                logger.debug("Correct answer for option ID: {}", answer.getOptionId());
            } else {
                logger.debug("Incorrect or invalid answer for option ID: {}", answer.getOptionId());
            }
        }
        logger.info("Quiz submitted, score: {}", score);
        return score;
    }

    // === AI-POWERED ADAPTIVE QUIZ ENDPOINTS ===

    @PostMapping("/ai/generate")
    public ResponseEntity<QuizResponseDTO> generateAIGeneratedQuiz(@RequestBody QuizRequestDTO request) {
        logger.info("🤖 Received request for AI-generated adaptive quiz: learnerId={}, topic={}, level={}",
                request.getLearnerId(), request.getTopic(), request.getLevel());
        try {
            QuizResponseDTO response = questionService.generateQuiz(request);
            logger.info("✅ AI quiz generated successfully for learner: {}", request.getLearnerId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error generating AI quiz for learner {}: {}", request.getLearnerId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/ai/save-result")
    public ResponseEntity<String> saveQuizResult(@RequestBody QuizResultDTO resultDTO) {
        logger.info("💾 Saving quiz result for learner: {}, question: {}, isCorrect: {}",
                resultDTO.getLearnerId(),
                resultDTO.getQuestionText() != null ? resultDTO.getQuestionText().substring(0, Math.min(50, resultDTO.getQuestionText().length())) + "..." : "null",
                resultDTO.getIsCorrect());
        try {
            QuizResult result = new QuizResult();
            result.setLearnerId(resultDTO.getLearnerId());
            result.setQuestionText(resultDTO.getQuestionText());
            result.setSelectedOptionText(resultDTO.getSelectedOptionText());
            result.setCorrectOptionText(resultDTO.getCorrectOptionText());
            result.setExplanation(resultDTO.getExplanation());
            result.setTopic(resultDTO.getTopic());
            result.setLevel(resultDTO.getLevel());
            result.setIsCorrect(resultDTO.getIsCorrect());
            result.setCreatedAt(LocalDateTime.now());

            quizResultsRepository.save(result);
            logger.info("✅ Quiz result saved successfully for learner: {}", resultDTO.getLearnerId());
            return ResponseEntity.ok("Quiz result saved successfully");
        } catch (Exception e) {
            logger.error("❌ Error saving quiz result for learner {}: {}", resultDTO.getLearnerId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save quiz result");
        }
    }

    // Endpoint để xem thống kê learner (optional, for debugging)
    @GetMapping("/learner-stats/{learnerId}")
    public ResponseEntity<Map<String, Object>> getLearnerStatistics(@PathVariable String learnerId) {
        logger.info("📊 Getting statistics for learner: {}", learnerId);
        try {
            Map<String, Object> stats = questionService.getLearnerStatistics(learnerId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("❌ Error getting learner statistics for {}: {}", learnerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get learner statistics"));
        }
    }
}