package com.pickle.backend.controller;

import com.pickle.backend.dto.AnswerDTO;
import com.pickle.backend.dto.OptionDTO;
import com.pickle.backend.dto.QuestionDTO;
import com.pickle.backend.entity.test.Option;
import com.pickle.backend.entity.test.Question;
import com.pickle.backend.repository.OptionRepository;
import com.pickle.backend.repository.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    // Khởi tạo Logger
    private static final Logger logger = LoggerFactory.getLogger(QuestionController.class);

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private OptionRepository optionRepo;

    @GetMapping
    public List<QuestionDTO> getAllQuestions() {
        logger.info("Received GET request to fetch all questions at {}", java.time.LocalDateTime.now());

        // Ghi log trước khi gọi repository
        logger.debug("Fetching all questions from repository");
        List<Question> questions;
        try {
            questions = questionRepo.findAll();
            logger.debug("Successfully fetched {} questions from repository", questions.size());
        } catch (Exception e) {
            logger.error("Failed to fetch questions from repository: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch questions: " + e.getMessage());
        }

        // Ghi log quá trình ánh xạ (mapping) sang DTO
        logger.debug("Mapping {} questions to DTOs", questions.size());
        List<QuestionDTO> questionDTOs = questions.stream().map(question -> {
            QuestionDTO dto = new QuestionDTO();
            try {
                dto.setId(question.getId());
                dto.setContent(question.getContent());
                logger.trace("Mapping question ID: {}, content: {}", question.getId(), question.getContent());

                // Ghi log chi tiết cho options
                List<OptionDTO> optionDTOs = question.getOptions().stream().map(option -> {
                    OptionDTO optionDTO = new OptionDTO();
                    optionDTO.setOptionId(option.getId());
                    optionDTO.setText(option.getText());
                    optionDTO.setCorrect(option.isCorrect());
                    logger.trace("Mapped option: text={}, correct={}",option.getId(), option.getText(), option.isCorrect());
                    return optionDTO;
                }).collect(Collectors.toList());
                dto.setOptions(optionDTOs);
                logger.trace("Mapped {} options for question ID: {}", optionDTOs.size(), question.getId());
            } catch (Exception e) {
                logger.error("Error mapping question ID {} to DTO: {}", question.getId(), e.getMessage(), e);
                throw new RuntimeException("Error mapping question to DTO: " + e.getMessage());
            }
            return dto;
        }).collect(Collectors.toList());

        // Ghi log kết quả cuối cùng
        logger.info("Successfully returned {} question DTOs", questionDTOs.size());
        return questionDTOs;
    }


    // CREATE - Tạo câu hỏi mới
    @PostMapping
    public Question createQuestion(@RequestBody QuestionDTO dto) {
        logger.info("Received POST request to create question: {}", dto);
        try {
            Question question = new Question();
            question.setContent(dto.getContent());
            logger.debug("Question content set to: {}", dto.getContent());

            List<Option> options = dto.getOptions().stream().map(optDto -> {
                Option option = new Option();
                option.setContent(optDto.getText());
                option.setCorrect(optDto.isCorrect());
                option.setQuestion(question);
                logger.debug("Option created - Text: {}, Correct: {}", optDto.getText(), optDto.isCorrect());
                return option;
            }).toList();

            question.setOptions(options);
            logger.debug("Options set for question, count: {}", options.size());

            Question savedQuestion = questionRepo.save(question);
            logger.info("Question saved successfully with ID: {}", savedQuestion.getId());
            return savedQuestion;
        } catch (Exception e) {
            logger.error("Error while creating question: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create question: " + e.getMessage());
        }
    }

    // UPDATE - Sửa câu hỏi
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        logger.info("Received PUT request to update question ID: {}", id);
        try {
            Question question = questionRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy câu hỏi"));
            question.setContent(dto.getContent());
            logger.debug("Question content updated to: {}", dto.getContent());

            // Xoá option cũ
            question.getOptions().clear();
            logger.debug("Old options cleared for question ID: {}", id);

            // Thêm option mới
            List<Option> options = dto.getOptions().stream().map(optDto -> {
                Option option = new Option();
                option.setContent(optDto.getText());
                option.setCorrect(optDto.isCorrect());
                option.setQuestion(question);
                logger.debug("New option - Text: {}, Correct: {}", optDto.getText(), optDto.isCorrect());
                return option;
            }).toList();

            question.setOptions(options);
            logger.debug("New options set for question, count: {}", options.size());

            Question updatedQuestion = questionRepo.save(question);
            logger.info("Question updated successfully with ID: {}", updatedQuestion.getId());
            return updatedQuestion;
        } catch (Exception e) {
            logger.error("Error while updating question ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update question: " + e.getMessage());
        }
    }

    // DELETE - Xoá câu hỏi
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        logger.info("Received DELETE request for question ID: {}", id);
        try {
            questionRepo.deleteById(id);
            logger.info("Question deleted successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error while deleting question ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete question: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Question getQuestion(@PathVariable Long id) {
        logger.info("Received GET request to get question by ID: {}", id);
        Question question = questionRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
        logger.info("Question retrieved successfully with ID: {}", id);
        return question;
    }

    @GetMapping("/quiz")
    public List<Question> getQuiz() {
        logger.info("Received GET request for quiz questions");
        Pageable pageable = PageRequest.of(0, 10);
        List<Question> questions = questionRepo.findRandomQuestions(pageable);
        logger.info("Found {} random questions for quiz", questions.size());
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
}
