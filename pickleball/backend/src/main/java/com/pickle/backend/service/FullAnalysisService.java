package com.pickle.backend.service;

import com.pickle.backend.entity.Learner;
import com.pickle.backend.entity.VideoAnalysis;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.MultiValueMap;
import org.springframework.core.ParameterizedTypeReference;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FullAnalysisService {
    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Map<String, Object> analyze(String learnerId, MultipartFile video, String selfAssessedLevel)
            throws IOException {
        Map<String, Object> response = new HashMap<>();
        String message = "Phân tích video thành công";
        VideoAnalysis analysis = new VideoAnalysis();
        UUID videoId = UUID.randomUUID();
        analysis.setVideoId(videoId.toString());
        analysis.setLearnerId(learnerId);
        analysis.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        // Tìm hoặc tạo Learner
        Learner learner = entityManager.find(Learner.class, learnerId);
        if (learner == null) {
            learner = new Learner();
            learner.setUserId(learnerId);
            learner.setSkillLevel("Beginner");
            learner.setGoals(objectMapper.writeValueAsString(List.of("Improve forehand")));
            learner.setProgress("0%");
            entityManager.persist(learner);
        }

        try {
            if (video != null) {
                if (video.getSize() > 50 * 1024 * 1024) {
                    throw new IOException("Video size exceeds 50MB limit");
                }
                String timestamp = String.valueOf(System.currentTimeMillis());
                String videoPath = "uploads/" + timestamp + "_" + video.getOriginalFilename();
                String fullVideoPath = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/" + videoPath;
                File videoFile = new File(fullVideoPath);
                video.transferTo(videoFile);
                if (!videoFile.exists() || !videoFile.canRead()) {
                    throw new IOException("Video file not accessible: " + fullVideoPath);
                }
                analysis.setVideoPath(videoPath);

                MultiValueMap<String, Object> request = new LinkedMultiValueMap<>();
                request.add("video", new FileSystemResource(videoFile));
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(request, headers);

                // Gọi pose-estimation
                ResponseEntity<Map<String, Object>> poseResponse = restTemplate.exchange(
                        "http://localhost:5000/pose-estimation",
                        HttpMethod.POST,
                        entity,
                        new ParameterizedTypeReference<Map<String, Object>>() {
                        });
                System.out.println("Pose response status: " + poseResponse.getStatusCode());
                System.out.println("Pose response body: " + poseResponse.getBody());
                Map<String, Object> poseBody = poseResponse.getBody();
                if (poseBody == null || !poseBody.containsKey("poseData") || !poseBody.containsKey("analysisResult")) {
                    throw new RuntimeException("Invalid response from pose-estimation: " + poseBody);
                }
                Map<String, Object> poseData = objectMapper.readValue((String) poseBody.get("poseData"),
                        new TypeReference<Map<String, Object>>() {
                        });
                Map<String, Object> analysisResult = objectMapper.readValue((String) poseBody.get("analysisResult"),
                        new TypeReference<Map<String, Object>>() {
                        });
                List<Map<String, Object>> feedbacks = (List<Map<String, Object>>) poseData.getOrDefault("feedbacks",
                        new ArrayList<>());
                List<String> poseSkillLevels = (List<String>) poseData.getOrDefault("skillLevels", new ArrayList<>());
                String userLevel = (String) poseData.getOrDefault("userLevel", "Intermediate");

                // Gọi movement-classification
                ResponseEntity<Map<String, Object>> classificationResponse = restTemplate.exchange(
                        "http://localhost:5001/movement-classification",
                        HttpMethod.POST,
                        entity,
                        new ParameterizedTypeReference<Map<String, Object>>() {
                        });
                System.out.println("Classification response status: " + classificationResponse.getStatusCode());
                System.out.println("Classification response body: " + classificationResponse.getBody());
                Map<String, Object> classBody = classificationResponse.getBody();
                if (classBody == null || !classBody.containsKey("classifiedMovements")) {
                    throw new RuntimeException("Invalid response from movement-classification: " + classBody);
                }
                Map<String, Object> classifiedMovements = objectMapper.readValue(
                        (String) classBody.get("classifiedMovements"), new TypeReference<Map<String, Object>>() {
                        });
                List<Map<String, Object>> labels = (List<Map<String, Object>>) classifiedMovements
                        .getOrDefault("labels", new ArrayList<>());
                List<String> movementSkillLevels = (List<String>) classifiedMovements.getOrDefault("skillLevels",
                        new ArrayList<>());

                analysis.setPoseData(objectMapper.writeValueAsString(poseData));
                analysis.setClassifiedMovements(objectMapper.writeValueAsString(classifiedMovements));
                analysis.setAnalysisResult(objectMapper.writeValueAsString(analysisResult));

                Map<String, String> analysisSummary = new HashMap<>();
                analysisSummary.put("summary", "Phân tích dựa trên " + labels.size() + " cú đánh");
                analysis.setAnalysisResult(objectMapper.writeValueAsString(analysisSummary));

                List<Map<String, String>> recommendations = new ArrayList<>();
                String recommendedLevel = userLevel.isEmpty() ? "Intermediate" : userLevel;
                if ("Beginner".equals(recommendedLevel)) {
                    recommendations
                            .add(Map.of("title", "I. Người mới bắt đầu (Beginner - Trình độ 1.0–2.5)", "description",
                                    "Khóa học cơ bản cho người mới", "url", "https://example.com/beginner_course"));
                    recommendations.add(Map.of("title", "Khóa học volley cơ bản", "level", "Beginner", "url",
                            "https://example.com/volley_basic"));
                } else if ("Intermediate".equals(recommendedLevel)) {
                    recommendations.add(Map.of("title", "II. Trình độ trung cấp (Intermediate – 3.0–3.5)",
                            "description", "Nâng cao kỹ thuật", "url", "https://example.com/intermediate_course"));
                    recommendations.add(Map.of("title", "Nâng cao forehand", "level", "Intermediate", "url",
                            "https://example.com/forehand_advanced"));
                } else if ("Advanced".equals(recommendedLevel)) {
                    recommendations
                            .add(Map.of("title", "III. Trình độ nâng cao (Advanced – 4.0 trở lên)", "description",
                                    "Chuẩn bị thi đấu chuyên nghiệp", "url", "https://example.com/advanced_course"));
                    recommendations.add(Map.of("title", "Kỹ thuật lob nâng cao", "level", "Advanced", "url",
                            "https://example.com/lob_advanced"));
                }
                analysis.setRecommendations(objectMapper.writeValueAsString(recommendations));
            } else if (selfAssessedLevel != null) {
                String recommendedLevel = mapSelfAssessedLevel(selfAssessedLevel);
                List<Map<String, String>> recommendations = new ArrayList<>();
                recommendations.add(Map.of("title", getLearningPathTitle(recommendedLevel), "description",
                        "Khóa học dựa trên tự đánh giá", "url",
                        "https://example.com/" + recommendedLevel.toLowerCase()));
                recommendations.add(Map.of("title", "Khóa học " + recommendedLevel, "level", recommendedLevel, "url",
                        "https://example.com/" + recommendedLevel.toLowerCase() + "_course"));
                analysis.setRecommendations(objectMapper.writeValueAsString(recommendations));
                Map<String, String> analysisSummary = new HashMap<>();
                analysisSummary.put("summary", "Đánh giá dựa trên tự đánh giá: " + selfAssessedLevel);
                analysis.setAnalysisResult(objectMapper.writeValueAsString(analysisSummary));
            }

            entityManager.persist(analysis);
            Map<String, Object> result = new HashMap<>();
            result.put("videoId", analysis.getVideoId());
            result.put("learnerId", analysis.getLearnerId());
            result.put("poseData",
                    objectMapper.readValue(analysis.getPoseData(), new TypeReference<Map<String, Object>>() {
                    }));
            result.put("classifiedMovements",
                    objectMapper.readValue(analysis.getClassifiedMovements(), new TypeReference<Map<String, Object>>() {
                    }));
            result.put("analysisResult",
                    objectMapper.readValue(analysis.getAnalysisResult(), new TypeReference<Map<String, Object>>() {
                    }));
            result.put("recommendations", objectMapper.readValue(analysis.getRecommendations(),
                    new TypeReference<List<Map<String, String>>>() {
                    }));
            result.put("videoPath", analysis.getVideoPath());
            result.put("createdAt", analysis.getCreatedAt());
            result.put("learner", learner);

            response.put("message", message);
            response.put("result", result);
            return response;
        } catch (Exception e) {
            message = "Phân tích video không thành công: " + e.getMessage();
            response.put("message", message);
            response.put("result", null);
            return response;
        }
    }

    private String determineUserLevel(List<String> poseSkillLevels) {
        String dominantLevel = poseSkillLevels.stream().filter(l -> !l.equals("unknown")).findFirst()
                .orElse("trung bình");
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