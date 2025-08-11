
package com.pickle.backend.service;

import com.pickle.backend.entity.QuizResult;
import com.pickle.backend.dto.QuizResponseDTO;
import com.pickle.backend.dto.QuizRequestDTO;
import com.pickle.backend.dto.QuizQuestionDTO;
import com.pickle.backend.dto.QuizOptionDTO;
import com.pickle.backend.repository.QuizResultsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.*;

@Service
public class QuestionService {
    private static final Logger logger = LoggerFactory.getLogger(QuestionService.class);

    @Autowired
    private QuizResultsRepository quizResultsRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public QuestionService(QuizResultsRepository quizResultsRepository) {
        this.quizResultsRepository = quizResultsRepository;
    }

    public QuizResponseDTO generateQuiz(QuizRequestDTO request) {
        logger.info("=== Generating adaptive quiz for learnerId: {}, topic: {}, level: {} ===",
                request.getLearnerId(), request.getTopic(), request.getLevel());

        try {
            // 1. Lấy lịch sử từ bảng quiz_results (10 kết quả gần nhất để phân tích tốt hơn)
            List<QuizResult> recentResults = quizResultsRepository
                    .findByLearnerIdOrderByCreatedAtDesc(request.getLearnerId())
                    .stream()
                    .limit(10)
                    .toList();

            logger.info("Found {} quiz results from quiz_results table for learner {}",
                    recentResults.size(), request.getLearnerId());

            // 2. Chuẩn bị data chi tiết cho AI service
            Map<String, Object> aiRequest = buildAIRequest(request, recentResults);

            // 3. Gọi AI service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(aiRequest, headers);

            String aiEndpoint = aiServiceUrl + "/generate-quiz";
            logger.info("Calling AI service at: {} with {} historical results",
                    aiEndpoint, recentResults.size());

            // Fixed: Proper generic type handling
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                    aiEndpoint,
                    entity,
                    (Class<Map<String, Object>>) (Class<?>) Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> aiResponse = response.getBody();

                // Log thông tin phân tích từ AI
                logQuizGenerationInfo(aiResponse, request.getLearnerId());

                QuizResponseDTO quizResponse = convertAIResponseToQuizResponseDTO(aiResponse, request);
                logger.info("Adaptive quiz generated successfully for learnerId: {}", request.getLearnerId());
                return quizResponse;
            } else {
                throw new RuntimeException("AI service returned invalid response");
            }

        } catch (HttpClientErrorException e) {
            logger.error("HTTP error calling AI service: Status: {}, Body: {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to generate quiz - AI service error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error generating adaptive quiz for learnerId: {}", request.getLearnerId(), e);
            throw new RuntimeException("Failed to generate adaptive quiz: " + e.getMessage());
        }
    }

    private Map<String, Object> buildAIRequest(QuizRequestDTO request, List<QuizResult> recentResults) {
        Map<String, Object> aiRequest = new HashMap<>();
        aiRequest.put("learner_id", request.getLearnerId());
        aiRequest.put("topic", request.getTopic());
        aiRequest.put("level", request.getLevel());

        // Chuyển đổi lịch sử kết quả với thông tin chi tiết từ quiz_results
        List<Map<String, Object>> lastResultsMap = recentResults.stream().map(result -> {
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("question_text", result.getQuestionText());
            resultMap.put("selected_option_text", result.getSelectedOptionText());
            resultMap.put("correct_option_text", result.getCorrectOptionText());
            resultMap.put("is_correct", result.getIsCorrect());
            resultMap.put("topic", result.getTopic());
            resultMap.put("level", result.getLevel());
            resultMap.put("explanation", result.getExplanation());
            resultMap.put("created_at", result.getCreatedAt().toString());
            return resultMap;
        }).toList();

        aiRequest.put("last_results", lastResultsMap);

        // Thêm thống kê tổng quan để AI hiểu rõ hơn về learner
        long totalQuestions = recentResults.size();
        long correctAnswers = recentResults.stream().mapToLong(r -> r.getIsCorrect() ? 1 : 0).sum();
        double correctRate = totalQuestions > 0 ? (double) correctAnswers / totalQuestions : 0.0;

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("total_questions", totalQuestions);
        statistics.put("correct_answers", correctAnswers);
        statistics.put("correct_rate", correctRate);
        statistics.put("has_history", totalQuestions > 0);

        aiRequest.put("learner_statistics", statistics);

        // Fixed: Correct number of placeholders
        logger.info("Sending to AI: {} historical results, correct rate: {:.1f}%",
                totalQuestions, correctRate * 100);

        return aiRequest;
    }

    private void logQuizGenerationInfo(Map<String, Object> aiResponse, String learnerId) {
        // Log thông tin phân tích từ AI (nếu có)
        if (aiResponse.containsKey("learner_analysis")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> analysis = (Map<String, Object>) aiResponse.get("learner_analysis");
            // Fixed: Correct number of placeholders
            logger.info("🎯 AI Analysis for {}: weak_topics={}, correct_rate={}, difficulty_adjusted={}, focus_areas={}",
                    learnerId,
                    analysis.get("weak_topics"),
                    analysis.get("correct_rate"),
                    analysis.get("difficulty_adjusted"),
                    analysis.get("focus_areas"));
        }
    }

    private QuizResponseDTO convertAIResponseToQuizResponseDTO(Map<String, Object> aiResponse, QuizRequestDTO request) {
        QuizResponseDTO quizResponse = new QuizResponseDTO();
        quizResponse.setTopic(request.getTopic());
        quizResponse.setLevel(request.getLevel());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> aiQuestions = (List<Map<String, Object>>) aiResponse.get("questions");

        if (aiQuestions == null || aiQuestions.isEmpty()) {
            throw new RuntimeException("No questions returned from AI service");
        }

        List<QuizQuestionDTO> questions = new ArrayList<>();

        for (Map<String, Object> aiQuestion : aiQuestions) {
            QuizQuestionDTO questionDTO = new QuizQuestionDTO();
            questionDTO.setQuestionText((String) aiQuestion.get("question_text"));
            questionDTO.setExplanation((String) aiQuestion.get("explanation"));

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> aiOptions = (List<Map<String, Object>>) aiQuestion.get("options");
            List<QuizOptionDTO> options = new ArrayList<>();

            if (aiOptions != null) {
                for (Map<String, Object> aiOption : aiOptions) {
                    QuizOptionDTO optionDTO = new QuizOptionDTO();
                    optionDTO.setId(((Number) aiOption.get("id")).intValue());
                    optionDTO.setText((String) aiOption.get("text"));
                    optionDTO.setCorrect((Boolean) aiOption.get("is_correct"));
                    options.add(optionDTO);
                }
            }

            questionDTO.setOptions(options);
            questions.add(questionDTO);
        }

        quizResponse.setQuestions(questions);

        // Thêm thông tin phân tích từ AI (nếu có)
        if (aiResponse.containsKey("learner_analysis")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> learnerAnalysis = (Map<String, Object>) aiResponse.get("learner_analysis");
            quizResponse.setLearnerAnalysis(learnerAnalysis);
        }

        return quizResponse;
    }

    // Thêm method để lấy thống kê learner cho dashboard (optional)
    public Map<String, Object> getLearnerStatistics(String learnerId) {
        List<QuizResult> allResults = quizResultsRepository.findByLearnerIdOrderByCreatedAtDesc(learnerId);

        long totalQuestions = allResults.size();
        long correctAnswers = allResults.stream().mapToLong(r -> r.getIsCorrect() ? 1 : 0).sum();
        double overallCorrectRate = totalQuestions > 0 ? (double) correctAnswers / totalQuestions : 0.0;

        // Phân tích theo topic
        Map<String, Long> topicStats = new HashMap<>();
        Map<String, Long> topicCorrectStats = new HashMap<>();

        for (QuizResult result : allResults) {
            String topic = result.getTopic() != null ? result.getTopic() : "general";
            topicStats.put(topic, topicStats.getOrDefault(topic, 0L) + 1);
            if (result.getIsCorrect()) {
                topicCorrectStats.put(topic, topicCorrectStats.getOrDefault(topic, 0L) + 1);
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("total_questions", totalQuestions);
        stats.put("correct_answers", correctAnswers);
        stats.put("overall_correct_rate", overallCorrectRate);
        stats.put("topic_statistics", topicStats);
        stats.put("topic_correct_statistics", topicCorrectStats);
        stats.put("last_quiz_date", allResults.isEmpty() ? null : allResults.get(0).getCreatedAt());

        logger.info("Learner {} statistics: {}/{} correct ({:.1f}%)",
                learnerId, correctAnswers, totalQuestions, overallCorrectRate * 100);

        return stats;
    }
}