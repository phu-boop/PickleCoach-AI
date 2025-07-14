package com.pickle.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pickle.backend.entity.Learner;
import com.pickle.backend.entity.User;
import com.pickle.backend.entity.VideoAnalysis;
import com.pickle.backend.entity.curriculum.Course;
import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.entity.curriculum.VideoLessonRecommendation;
import com.pickle.backend.repository.curriculum.CourseRepository;
import com.pickle.backend.repository.curriculum.LessonRepository;
import com.pickle.backend.repository.curriculum.VideoLessonRecommendationRepository;
import com.pickle.backend.repository.VideoAnalysisRepository;
import com.pickle.backend.service.curriculum.CurriculumService;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class FullAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(FullAnalysisService.class);
    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private VideoAnalysisRepository videoAnalysisRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserService userService; // Thêm UserService

    @Autowired
    private VideoLessonRecommendationRepository videoLessonRecommendationRepository;

    @Autowired
    private CurriculumService curriculumService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Map<String, Object> analyze(String userId, MultipartFile video) throws IOException {
        Map<String, Object> response = new HashMap<>();
        VideoAnalysis analysis = new VideoAnalysis();
        UUID videoId = UUID.randomUUID();
        analysis.setVideoId(videoId.toString());
        analysis.setUserId(userId);
        analysis.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        Learner learner = findOrCreateLearner(userId);

        File tempFile = null;
        String tempVideoPath = null;
        String finalVideoPath = null;
        Map<String, Object> analysisResponse = null;
        try {
            if (video != null) {
                validateVideo(video);
                // 1. Lưu file tạm vào TempUploads
                tempVideoPath = saveVideoFileToDir(video, "TempUploads");
                tempFile = new File("D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/" + tempVideoPath);

                // 2. Gọi Python API kiểm tra hợp lệ
                analysisResponse = callEnhancedAnalysisAPI(tempVideoPath, userId);
                if (analysisResponse == null || analysisResponse.containsKey("error")) {
                    // Xóa file tạm nếu không hợp lệ
                    if (tempFile.exists()) tempFile.delete();
                    String errMsg = analysisResponse != null && analysisResponse.get("error") != null ? analysisResponse.get("error").toString() : "Video không hợp lệ";
                    response.put("message", errMsg);
                    response.put("result", null);
                    return response;
                }
                // 3. Nếu hợp lệ, chuyển file sang Uploads
                finalVideoPath = moveTempToUploads(tempFile, video.getOriginalFilename());
                analysis.setVideoPath(finalVideoPath);
                processEnhancedAnalysisResponse(analysis, analysisResponse, learner);
            }

            entityManager.persist(analysis);
            Map<String, Object> result = buildAnalysisResult(analysis, learner);

            // Lưu bài học đề xuất dựa trên kết quả phân tích
            if (video != null) {
                saveVideoLessonRecommendations(userId, analysisResponse, analysis.getVideoId());
            }

            response.put("message", "Phân tích thành công");
            response.put("result", result);
            return response;
        } catch (Exception e) {
            logger.error("Error in analyze method: {}", e.getMessage(), e);
            // Xóa file tạm nếu có lỗi
            if (tempFile != null && tempFile.exists()) tempFile.delete();
            response.put("message", "Phân tích video không thành công: " + e.getMessage());
            response.put("result", null);
            return response;
        }
    }

    private Learner findOrCreateLearner(String userId) throws IOException {
        Learner learner = entityManager.find(Learner.class, userId);
        if (learner == null) {
            logger.debug("Creating new Learner with userId: {}", userId);
            learner = new Learner();
            learner.setUserId(userId);

            // Tải User từ userId
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            learner.setUser(user); // Gán User

            learner.setSkillLevel("Beginner");
            learner.setGoals(objectMapper.writeValueAsString(List.of("Improve technique")));
            learner.setProgress("0%");
            entityManager.persist(learner);
        }
        return learner;
    }

    private void validateVideo(MultipartFile video) throws IOException {
        if (video.getSize() > MAX_FILE_SIZE) {
            throw new IOException("Video size exceeds " + (MAX_FILE_SIZE / 1024 / 1024) + "MB limit");
        }

        String contentType = video.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new IOException("Invalid file type. Only video files are allowed.");
        }
    }

    // Lưu file vào thư mục chỉ định (TempUploads hoặc Uploads)
    private String saveVideoFileToDir(MultipartFile video, String dirName) throws IOException {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String filename = timestamp + "_" + video.getOriginalFilename();
        String videoPath = dirName + "/" + filename;
        String fullVideoPath = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/" + videoPath;

        File videoFile = new File(fullVideoPath);
        File directory = videoFile.getParentFile();
        if (!directory.exists() && !directory.mkdirs()) {
            throw new IOException("Failed to create directory: " + directory.getAbsolutePath());
        }
        video.transferTo(videoFile);
        if (!videoFile.exists() || !videoFile.canRead()) {
            throw new IOException("Video file not accessible: " + fullVideoPath);
        }
        return videoPath;
    }

    // Di chuyển file từ TempUploads sang Uploads
    private String moveTempToUploads(File tempFile, String originalFilename) throws IOException {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String filename = timestamp + "_" + originalFilename;
        String uploadsPath = "Uploads/" + filename;
        String fullUploadsPath = "D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/" + uploadsPath;
        File uploadsFile = new File(fullUploadsPath);
        File uploadsDir = uploadsFile.getParentFile();
        if (!uploadsDir.exists() && !uploadsDir.mkdirs()) {
            throw new IOException("Failed to create uploads directory: " + uploadsDir.getAbsolutePath());
        }
        if (!tempFile.renameTo(uploadsFile)) {
            throw new IOException("Failed to move file to uploads");
        }
        return uploadsPath;
    }

    private Map<String, Object> callEnhancedAnalysisAPI(String videoPath, String userId) { // Thay learnerId thành
                                                                                           // userId
        MultiValueMap<String, Object> request = new LinkedMultiValueMap<>();
        request.add("video",
                new FileSystemResource(new File("D:/LTJAVA/Project/PickleCoach-AI/pickleball/backend/" + videoPath)));
        request.add("userId", userId); // Thay learnerId thành userId
        request.add("analysisType", "enhanced");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(request, headers);

        logger.debug("Sending enhanced analysis request to Python API");
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                "http://localhost:5000/video-analysis-enhanced",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {
                });

        return response.getBody();
    }

    @SuppressWarnings("unchecked")
    private void processEnhancedAnalysisResponse(VideoAnalysis analysis, Map<String, Object> responseBody,
            Learner learner)
            throws IOException {

        if (responseBody == null) {
            throw new RuntimeException("Empty response from enhanced analysis API");
        }

        // Xử lý detailed feedbacks
        List<Map<String, Object>> detailedFeedbacks = (List<Map<String, Object>>) responseBody
                .get("detailed_feedbacks");
        if (detailedFeedbacks == null) {
            throw new RuntimeException("Missing detailed_feedbacks in response");
        }

        // Xử lý technique analysis
        Map<String, Object> techniqueAnalysis = (Map<String, Object>) responseBody.get("techniqueAnalysis");
        if (techniqueAnalysis == null) {
            throw new RuntimeException("Missing techniqueAnalysis in response");
        }

        // Xử lý shot analysis
        Map<String, Object> shotAnalysis = (Map<String, Object>) responseBody.get("shotAnalysis");
        if (shotAnalysis == null) {
            throw new RuntimeException("Missing shotAnalysis in response");
        }

        // Xử lý performance metrics
        Map<String, Object> performanceMetrics = (Map<String, Object>) responseBody.get("performanceMetrics");
        if (performanceMetrics == null) {
            throw new RuntimeException("Missing performanceMetrics in response");
        }

        // Xác định skill level từ average score
        Double averageScore = (Double) performanceMetrics.get("averageScore");
        String skillLevel = mapScoreToSkillLevel(averageScore);

        // Tạo recommendations từ bảng courses
        List<Map<String, String>> recommendations = generateEnhancedRecommendations(
                detailedFeedbacks, shotAnalysis, skillLevel);

        // Cập nhật learner skill level
        learner.setSkillLevel(skillLevel);
        entityManager.merge(learner);

        // Lưu vào database
        analysis.setDetailedFeedbacks(objectMapper.writeValueAsString(detailedFeedbacks));
        analysis.setShotAnalysis(objectMapper.writeValueAsString(shotAnalysis));
        analysis.setAnalysisResult(objectMapper.writeValueAsString(Map.of(
                "techniqueAnalysis", techniqueAnalysis,
                "performanceMetrics", performanceMetrics,
                "summary", generateAnalysisSummary(averageScore, detailedFeedbacks.size()))));
        analysis.setRecommendations(objectMapper.writeValueAsString(recommendations));
    }

    private String mapScoreToSkillLevel(Double averageScore) {
        if (averageScore == null)
            return "Intermediate";
        if (averageScore >= 80)
            return "Advanced";
        else if (averageScore >= 50)
            return "Intermediate";
        else
            return "Beginner";
    }

    private List<Map<String, String>> generateEnhancedRecommendations(
            List<Map<String, Object>> detailedFeedbacks,
            Map<String, Object> shotAnalysis,
            String userLevel) {

        List<Map<String, String>> recommendations = new ArrayList<>();
        Course.LevelRequired levelRequired = mapSkillLevelToLevelRequired(userLevel);

        // Phân tích lỗi phổ biến từ detailed feedbacks
        Map<String, Long> commonIssues = analyzeCommonIssues(detailedFeedbacks);

        // Truy vấn tất cả khóa học phù hợp với level
        List<Course> courses = courseRepository.findByLevelRequired(levelRequired);
        logger.debug("Found {} courses for level {}, issues: {}", courses.size(), levelRequired, commonIssues.keySet());

        // Sắp xếp các vấn đề theo tần suất để ưu tiên recommendations
        List<Map.Entry<String, Long>> sortedIssues = commonIssues.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toList());

        // Lọc khóa học dựa trên vấn đề kỹ thuật (nếu có lessons liên kết)
        for (Map.Entry<String, Long> issue : sortedIssues) {
            if (issue.getValue() >= 1) { // Xem xét mọi vấn đề, kể cả xuất hiện 1 lần
                Lesson.SkillType skillType = mapIssueToSkillType(issue.getKey());
                if (skillType != null) {
                    List<Course> matchingCourses = courses.stream()
                            .filter(course -> course.getLessons().stream()
                                    .anyMatch(lesson -> lesson.getSkillType() == skillType))
                            .collect(Collectors.toList());
                    recommendations.addAll(matchingCourses.stream()
                            .map(course -> Map.of(
                                    "title", course.getTitle(),
                                    "description",
                                    course.getDescription() != null ? course.getDescription()
                                            : "Khóa học cải thiện kỹ năng " + userLevel.toLowerCase(),
                                    "url",
                                    course.getCourseUrl() != null ? course.getCourseUrl()
                                            : (course.getThumbnailUrl() != null ? course.getThumbnailUrl() : "")))
                            .collect(Collectors.toList()));
                }
            }
        }

        // Đề xuất từ shot analysis
        if (shotAnalysis.containsKey("weakestShots")) {
            List<String> weakestShots = (List<String>) shotAnalysis.get("weakestShots");
            for (String shot : weakestShots) {
                Lesson.SkillType skillType = mapShotToSkillType(shot);
                if (skillType != null) {
                    List<Course> matchingCourses = courses.stream()
                            .filter(course -> course.getLessons().stream()
                                    .anyMatch(lesson -> lesson.getSkillType() == skillType))
                            .collect(Collectors.toList());
                    recommendations.addAll(matchingCourses.stream()
                            .map(course -> Map.of(
                                    "title", course.getTitle(),
                                    "description",
                                    course.getDescription() != null ? course.getDescription()
                                            : "Khóa học cải thiện cú " + shot,
                                    "url",
                                    course.getCourseUrl() != null ? course.getCourseUrl()
                                            : (course.getThumbnailUrl() != null ? course.getThumbnailUrl() : "")))
                            .collect(Collectors.toList()));
                }
            }
        }

        // Thêm tất cả khóa học phù hợp với levelRequired
        recommendations.addAll(courses.stream()
                .filter(course -> !recommendations.stream()
                        .anyMatch(rec -> rec.get("title").equals(course.getTitle())))
                .map(course -> Map.of(
                        "title", course.getTitle(),
                        "description",
                        course.getDescription() != null ? course.getDescription()
                                : "Khóa học nâng cao kỹ năng " + userLevel.toLowerCase(),
                        "url",
                        course.getCourseUrl() != null ? course.getCourseUrl()
                                : (course.getThumbnailUrl() != null ? course.getThumbnailUrl() : "")))
                .collect(Collectors.toList()));

        // Loại bỏ trùng lặp, trả về tất cả recommendations
        return recommendations.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Long> analyzeCommonIssues(List<Map<String, Object>> detailedFeedbacks) {
        Map<String, Long> issueCount = new HashMap<>();

        for (Map<String, Object> feedback : detailedFeedbacks) {
            Map<String, Object> grip = (Map<String, Object>) feedback.get("grip");
            if (grip != null && !grip.get("type").equals("eastern_grip")) {
                issueCount.merge("grip_issue", 1L, Long::sum);
            }

            Map<String, Object> balance = (Map<String, Object>) feedback.get("balance");
            if (balance != null && (balance.get("status").equals("unstable")
                    || balance.get("status").equals("slightly_unstable"))) {
                issueCount.merge("balance_issue", 1L, Long::sum);
            }

            Map<String, Object> shot = (Map<String, Object>) feedback.get("shot");
            if (shot != null) {
                String shotType = (String) shot.get("type");
                if (!shotType.equals("unknown")) {
                    issueCount.merge(shotType + "_issue", 1L, Long::sum);
                }
            }

            Object scoreObj = feedback.get("overall_score");
            if (scoreObj instanceof Number) {
                int score = ((Number) scoreObj).intValue();
                if (score < 50) {
                    issueCount.merge("low_technique_score", 1L, Long::sum);
                }
            }
        }

        return issueCount;
    }

    private Course.LevelRequired mapSkillLevelToLevelRequired(String skillLevel) {
        return switch (skillLevel) {
            case "Advanced" -> Course.LevelRequired.ADVANCED;
            case "Intermediate" -> Course.LevelRequired.INTERMEDIATE;
            case "Beginner" -> Course.LevelRequired.BEGINNER;
            default -> Course.LevelRequired.INTERMEDIATE;
        };
    }

    private Lesson.SkillType mapIssueToSkillType(String issueKey) {
        return switch (issueKey) {
            case "forehand_issue" -> Lesson.SkillType.FOREHAND;
            case "backhand_issue" -> Lesson.SkillType.BACKHAND;
            case "serve_issue" -> Lesson.SkillType.SERVE;
            case "dink_issue" -> Lesson.SkillType.DINK;
            case "half_volley_issue" -> Lesson.SkillType.DINK;
            case "balance_issue" -> Lesson.SkillType.BALANCE;
            case "grip_issue" -> Lesson.SkillType.GRIP;
            default -> null;
        };
    }

    private Lesson.SkillType mapShotToSkillType(String shot) {
        return switch (shot.toLowerCase()) {
            case "forehand" -> Lesson.SkillType.FOREHAND;
            case "backhand" -> Lesson.SkillType.BACKHAND;
            case "serve" -> Lesson.SkillType.SERVE;
            case "dink" -> Lesson.SkillType.DINK;
            case "half_volley" -> Lesson.SkillType.DINK;
            default -> null;
        };
    }

    private String generateAnalysisSummary(Double averageScore, int totalFrames) {
        return String.format("Phân tích %d khung hình với điểm trung bình %.1f/100. %s",
                totalFrames,
                averageScore,
                averageScore >= 70 ? "Kỹ thuật tốt, tiếp tục duy trì!"
                        : averageScore >= 50 ? "Cần cải thiện một số kỹ thuật."
                                : "Nên tập trung vào các kỹ năng cơ bản.");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> buildAnalysisResult(VideoAnalysis analysis, Learner learner) throws IOException {
        Map<String, Object> learningPath = new HashMap<>();

        // Lấy dữ liệu từ analysis
        List<Map<String, Object>> detailedFeedbacks = objectMapper.readValue(
                analysis.getDetailedFeedbacks(), new TypeReference<List<Map<String, Object>>>() {
                });

        Map<String, Object> shotAnalysis = objectMapper.readValue(
                analysis.getShotAnalysis(), new TypeReference<Map<String, Object>>() {
                });

        Map<String, Object> analysisResult = objectMapper.readValue(
                analysis.getAnalysisResult(), new TypeReference<Map<String, Object>>() {
                });

        List<Map<String, String>> recommendations = objectMapper.readValue(
                analysis.getRecommendations(), new TypeReference<List<Map<String, String>>>() {
                });

        // Lấy averageScore từ performanceMetrics
        Map<String, Object> performanceMetrics = (Map<String, Object>) analysisResult.get("performanceMetrics");
        Double averageScore = performanceMetrics != null ? (Double) performanceMetrics.get("averageScore") : null;

        // Xây dựng learningPath
        learningPath.put("skillLevel", learner.getSkillLevel());
        learningPath.put("summary", analysisResult.get("summary"));
        learningPath.put("averageScore", averageScore);
        learningPath.put("shotAnalysis", shotAnalysis);
        learningPath.put("detailedFeedbacks", detailedFeedbacks);
        learningPath.put("recommendations", recommendations);

        return learningPath;
    }

    /**
     * Lưu bài học đề xuất dựa trên kết quả phân tích video
     */
    @SuppressWarnings("unchecked")
    private void saveVideoLessonRecommendations(String userId, Map<String, Object> analysisResponse, String videoAnalysisId) {
        try {
            // Lấy thông tin từ kết quả phân tích
            String skillLevel = (String) analysisResponse.get("skill_level");
            Double averageScore = (Double) analysisResponse.get("average_score");
            
            Map<String, Object> shotAnalysis = (Map<String, Object>) analysisResponse.get("shotAnalysis");
            List<String> weakestShots = shotAnalysis != null ? 
                (List<String>) shotAnalysis.get("weakest_shots") : new ArrayList<>();

            // Lấy bài học đề xuất
            List<Lesson> recommendedLessons = curriculumService.getRecommendedLessonsBasedOnAnalysis(
                userId, skillLevel, weakestShots);

            // Chuyển đổi thành JSON strings
            List<String> lessonIds = recommendedLessons.stream()
                .map(lesson -> lesson.getId().toString())
                .collect(Collectors.toList());

            // Tạo hoặc cập nhật VideoLessonRecommendation
            VideoLessonRecommendation recommendation = videoLessonRecommendationRepository
                .findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElse(new VideoLessonRecommendation());

            recommendation.setUserId(userId);
            recommendation.setVideoAnalysisId(videoAnalysisId);
            recommendation.setSkillLevel(skillLevel);
            recommendation.setAverageScore(averageScore);
            recommendation.setWeakestShots(objectMapper.writeValueAsString(weakestShots));
            recommendation.setRecommendedLessonIds(objectMapper.writeValueAsString(lessonIds));

            videoLessonRecommendationRepository.save(recommendation);

            logger.info("Đã lưu {} bài học đề xuất cho user {} dựa trên phân tích video", 
                       recommendedLessons.size(), userId);

        } catch (Exception e) {
            logger.error("Lỗi khi lưu bài học đề xuất cho user {}: {}", userId, e.getMessage(), e);
        }
    }
}