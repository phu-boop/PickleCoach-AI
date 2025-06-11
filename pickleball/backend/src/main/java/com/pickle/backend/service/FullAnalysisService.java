package com.pickle.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.persistence.Query;

import com.pickle.backend.entity.VideoAnalysis;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.FileSystemResource;
import org.springframework.util.MultiValueMap;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import com.pickle.backend.entity.Learner;


@Transactional
@Service
public class FullAnalysisService {
    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RestTemplate restTemplate;

    public VideoAnalysis analyze(String learnerId, MultipartFile video, String selfAssessedLevel) throws IOException {
        UUID videoId = UUID.randomUUID();
        VideoAnalysis analysis = new VideoAnalysis();
        analysis.setVideoId(videoId.toString());
        analysis.setLearnerId(learnerId);
        analysis.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        // Kiểm tra learnerId tồn tại trong bảng learners
        Query query = entityManager.createQuery("SELECT l FROM Learner l WHERE l.userId = :learnerId");
        query.setParameter("learnerId", learnerId);
        List<Learner> learners = query.getResultList();
        if (learners.isEmpty()) {
            throw new IllegalArgumentException("Learner ID " + learnerId + " does not exist in the database.");
        }

        // Xử lý video hoặc selfAssessedLevel
        if (video != null) {
            if (video.getSize() > 50 * 1024 * 1024) {
                throw new IOException("Video size exceeds 50MB limit");
            }
            String timestamp = String.valueOf(System.currentTimeMillis());
            String videoPath = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/uploads/" + timestamp + "_" + video.getOriginalFilename();
            File videoFile = new File(videoPath);
            video.transferTo(videoFile);
            if (!videoFile.exists() || !videoFile.canRead()) {
                throw new IOException("Video file not accessible: " + videoPath);
            }

            MultiValueMap<String, Object> request = new LinkedMultiValueMap<>();
            request.add("video", new FileSystemResource(videoFile));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(request, headers);

            try {
                ResponseEntity<Map<String, Object>> poseResponse = restTemplate.exchange(
                    "http://localhost:5000/pose-estimation",
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {});
                System.out.println("Pose response status: " + poseResponse.getStatusCode());
                System.out.println("Pose response body: " + poseResponse.getBody());
                Map<String, Object> poseBody = poseResponse.getBody();
                if (poseBody == null) {
                    throw new RuntimeException("No response body from pose-estimation");
                }
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> feedbacks = (List<Map<String, Object>>) poseBody.getOrDefault("feedbacks", new ArrayList<>());
                Object skillLevelsObj = poseBody.getOrDefault("skillLevels", new ArrayList<>());
                List<String> poseSkillLevels = new ArrayList<>();
                if (skillLevelsObj instanceof List<?>) {
                    for (Object item : (List<?>) skillLevelsObj) {
                        if (item instanceof String) {
                            poseSkillLevels.add((String) item);
                        }
                    }
                }
                String userLevel = determineUserLevel(poseSkillLevels);
                ObjectMapper objectMapper = new ObjectMapper();
                String poseData = objectMapper.writeValueAsString(
                    Map.of("feedbacks", feedbacks, "skillLevels", poseSkillLevels, "userLevel", userLevel));
                analysis.setPoseData(poseData);

                ResponseEntity<Map<String, Object>> classificationResponse = restTemplate.exchange(
                    "http://localhost:5001/movement-classification",
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {});
                System.out.println("Classification response status: " + classificationResponse.getStatusCode());
                System.out.println("Classification response body: " + classificationResponse.getBody());
                Object classBodyObj = classificationResponse.getBody();
                Map<String, Object> classBody = new HashMap<>();
                if (classBodyObj instanceof Map<?, ?>) {
                    Map<?, ?> rawMap = (Map<?, ?>) classBodyObj;
                    Map<String, Object> safeMap = new HashMap<>();
                    for (Map.Entry<?, ?> entry : rawMap.entrySet()) {
                        if (entry.getKey() instanceof String) {
                            safeMap.put((String) entry.getKey(), entry.getValue());
                        }
                    }
                    classBody = safeMap;
                }
                Object labelsObj = classBody.getOrDefault("labels", new ArrayList<>());
                List<Map<String, Object>> labels = new ArrayList<>();
                if (labelsObj instanceof List<?>) {
                    for (Object item : (List<?>) labelsObj) {
                        if (item instanceof Map<?, ?>) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> labelMap = (Map<String, Object>) item;
                            labels.add(labelMap);
                        }
                    }
                }

                @SuppressWarnings("unchecked")
                List<String> movementSkillLevels = (List<String>) classBody.getOrDefault("skillLevels", new ArrayList<>());
                String classifiedMovements = objectMapper.writeValueAsString(
                    Map.of("labels", labels, "skillLevels", movementSkillLevels));
                analysis.setClassifiedMovements(classifiedMovements);

                String analysisResult = objectMapper.writeValueAsString(
                    Map.of("summary", "Phân tích dựa trên " + labels.size() + " cú đánh"));
                List<Map<String, String>> recommendations = new ArrayList<>();
                String recommendedLevel = userLevel;
                if ("Beginner".equals(recommendedLevel)) {
                    recommendations.add(Map.of("title", "I. Người mới bắt đầu (Beginner - Trình độ 1.0–2.5)", "description", "Khóa học cơ bản cho người mới", "url", "https://example.com/beginner_course"));
                    recommendations.add(Map.of("title", "Khóa học volley cơ bản", "level", "Beginner", "url", "https://example.com/volley_basic"));
                } else if ("Intermediate".equals(recommendedLevel)) {
                    recommendations.add(Map.of("title", "II. Trình độ trung cấp (Intermediate – 3.0–3.5)", "description", "Nâng cao kỹ thuật", "url", "https://example.com/intermediate_course"));
                    recommendations.add(Map.of("title", "Nâng cao forehand", "level", "Intermediate", "url", "https://example.com/forehand_advanced"));
                } else if ("Advanced".equals(recommendedLevel)) {
                    recommendations.add(Map.of("title", "III. Trình độ nâng cao (Advanced – 4.0 trở lên)", "description", "Chuẩn bị thi đấu chuyên nghiệp", "url", "https://example.com/advanced_course"));
                    recommendations.add(Map.of("title", "Kỹ thuật lob nâng cao", "level", "Advanced", "url", "https://example.com/lob_advanced"));
                }
                for (Map<String, Object> feedback : feedbacks) {
                    String fb = (String) feedback.get("feedback");
                    if ("Duỗi thẳng khuỷu tay".equals(fb)) {
                        recommendations.add(Map.of("title", "Bài tập khuỷu tay", "level", "Beginner", "url", "https://example.com/elbow_exercise"));
                    }
                }
                String recommendationsJson = objectMapper.writeValueAsString(recommendations);
                analysis.setRecommendations(recommendationsJson);
                analysis.setAnalysisResult(analysisResult);
            } catch (HttpClientErrorException e) {
                System.err.println("Error from microservice: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                throw new RuntimeException("Microservice failed: " + e.getMessage());
            }
        } else if (selfAssessedLevel != null) {
            String recommendedLevel = mapSelfAssessedLevel(selfAssessedLevel);
            ObjectMapper objectMapper = new ObjectMapper();
            String recommendationsJson = objectMapper.writeValueAsString(
                List.of(
                    Map.of("title", getLearningPathTitle(recommendedLevel), "description", "Khóa học dựa trên tự đánh giá", "url", "https://example.com/" + recommendedLevel.toLowerCase()),
                    Map.of("title", "Khóa học " + recommendedLevel, "level", recommendedLevel, "url", "https://example.com/" + recommendedLevel.toLowerCase() + "_course")));
            analysis.setRecommendations(recommendationsJson);
            analysis.setAnalysisResult(objectMapper.writeValueAsString(
                Map.of("summary", "Đánh giá dựa trên tự đánh giá: " + selfAssessedLevel)));
        }

        entityManager.persist(analysis);
        return analysis;
    }

    private String determineUserLevel(List<String> poseSkillLevels) {
        String dominantLevel = poseSkillLevels.stream().filter(l -> !l.equals("unknown")).findFirst().orElse("trung bình");
        return switch (dominantLevel) {
            case "rất yếu", "yếu" -> "Beginner";
            case "trung bình" -> "Intermediate";
            case "khá", "tốt" -> "Advanced";
            default -> "Intermediate";
        };
    }

    private String mapSelfAssessedLevel(String level) {
        return switch (level.toLowerCase()) {
            case "newbie" -> "Beginner";
            case "basic" -> "Intermediate";
            case "advanced" -> "Advanced";
            default -> "Intermediate";
        };
    }

    private String getLearningPathTitle(String level) {
        return switch (level) {
            case "Beginner" -> "I. Người mới bắt đầu (Beginner - Trình độ 1.0–2.5)";
            case "Intermediate" -> "II. Trình độ trung cấp (Intermediate – 3.0–3.5)";
            case "Advanced" -> "III. Trình độ nâng cao (Advanced – 4.0 trở lên)";
            default -> "II. Trình độ trung cấp (Intermediate – 3.0–3.5)";
        };
    }
}