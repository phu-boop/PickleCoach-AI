package com.pickle.backend.service.curriculum;

import com.pickle.backend.entity.curriculum.LearnerProgress;
import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.entity.curriculum.Course;
import com.pickle.backend.repository.curriculum.LearnerProgressRepository;
import com.pickle.backend.repository.curriculum.LessonRepository;
import com.pickle.backend.repository.curriculum.CourseRepository;
import com.pickle.backend.repository.curriculum.VideoLessonRecommendationRepository;
import com.pickle.backend.entity.curriculum.VideoLessonRecommendation;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class CurriculumService {

    private static final Logger logger = LoggerFactory.getLogger(CurriculumService.class);

    @Autowired
    private LearnerProgressRepository learnerProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private VideoLessonRecommendationRepository videoLessonRecommendationRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Lesson> getRecommendedLessons(String learnerId) {
        logger.info("Bat dau lay bai hoc de xuat cho learnerId: {}", learnerId);

        List<LearnerProgress> progressList = learnerProgressRepository.findIncompleteByLearnerId(learnerId);
        logger.info("Tim thay {} tien do hoc tap chua hoan thanh cho learnerId: {}", progressList.size(), learnerId);

        List<Lesson> recommendedLessons = new ArrayList<>();

        // Logic de xuat: Lay bai hoc tu cac tien do chua hoan thanh
        if (progressList.isEmpty()) {
            logger.info("Khong tim thay tien do hoc tap chua hoan thanh cho learnerId: {}. Chuyen sang de xuat bai hoc dau tien.", learnerId);
        } else {
            for (LearnerProgress progress : progressList) {
                // Su dung progress.getLearnerId() thay vi progress.getLearner().getId()
                logger.debug("Xu ly tien do cho Lesson ID: {} va Learner ID: {}", progress.getLesson().getId(), progress.getLearnerId());

                lessonRepository.findById(progress.getLesson().getId())
                        .ifPresent(lesson -> {
                            recommendedLessons.add(lesson);
                            logger.info("Da them bai hoc de xuat tu tien do chua hoan thanh: Lesson ID = {}, Tieu de = {}", lesson.getId(), lesson.getTitle());
                        });
            }
        }

        // Neu khong co bai hoc chua hoan thanh duoc de xuat (tu danh sach progressList rong hoac khong tim thay bai hoc tuong ung)
        if (recommendedLessons.isEmpty()) {
            logger.info("recommendedLessons rong sau khi kiem tra tien do. Tim kiem bai hoc dau tien trong bat ky khoa hoc nao.");
            lessonRepository.findAll().stream()
                    .filter(lesson -> lesson.getOrderInCourse() == 1)
                    .findFirst()
                    .ifPresent(lesson -> {
                        recommendedLessons.add(lesson);
                        logger.info("Da them bai hoc dau tien cua khoa hoc lam de xuat: Lesson ID = {}, Tieu de = {}", lesson.getId(), lesson.getTitle());
                    });

            if (recommendedLessons.isEmpty()) {
                logger.warn("Khong tim thay bai hoc nao de xuat, ke ca bai hoc dau tien cua khoa hoc.");
            }
        } else {
            logger.info("Da tim thay {} bai hoc de xuat tu tien do chua hoan thanh.", recommendedLessons.size());
        }

        logger.info("Ket thuc lay bai hoc de xuat cho learnerId: {}. Tong so bai hoc de xuat: {}", learnerId, recommendedLessons.size());
        return recommendedLessons;
    }

    public String updateLessonComplete(Long id){
        learnerProgressRepository.updateIsCompletedById(id);
        return "OK";
    }
    public boolean checkProgress(UUID lessonId, String learnerId) {
        return learnerProgressRepository.existsByLearnerIdAndLessonId(learnerId, lessonId);
    }
    @Transactional
    public long getIdProgressByLessonId(UUID lessonId, String learnerId) {
        // Lấy tất cả các id khớp với lessonId và learnerId
        List<Long> ids = learnerProgressRepository.findIdsByLessonIdAndLearnerId(lessonId, learnerId);

        if (ids.isEmpty()) {
            return -1L;
        }

        if (ids.size() == 1) {
            return ids.get(0);
        }

        Long idToKeep = ids.stream()
                .max(Long::compare)
                .orElseThrow(() -> new RuntimeException("No valid id found"));


        List<Long> idsToDelete = ids.stream()
                .filter(id -> !id.equals(idToKeep))
                .toList();


        if (!idsToDelete.isEmpty()) {
            learnerProgressRepository.deleteByIds(idsToDelete);
        }

        return idToKeep; // Trả về id của hàng được giữ lại
    }
    public boolean checkCompleted(Long id){
        return learnerProgressRepository.checkCompleted(id);
    }

    /**
     * Lấy bài học đề xuất dựa trên skill level và weakest shots từ video analysis
     */
    public List<Lesson> getRecommendedLessonsBasedOnAnalysis(String learnerId, String skillLevel, List<String> weakestShots) {
        logger.info("Bat dau lay bai hoc de xuat dua tren phan tich video cho learnerId: {}, skillLevel: {}, weakestShots: {}", 
                   learnerId, skillLevel, weakestShots);

        List<Lesson> recommendedLessons = new ArrayList<>();
        Set<UUID> addedLessonIds = new HashSet<>();

        // Chuyển đổi skill level thành level required
        Lesson.LevelRequired levelRequired = mapSkillLevelToLevelRequired(skillLevel);
        
        // 1. Đề xuất bài học dựa trên weakest shots
        if (weakestShots != null && !weakestShots.isEmpty()) {
            for (String shot : weakestShots) {
                Lesson.SkillType skillType = mapShotToSkillType(shot);
                if (skillType != null) {
                    List<Lesson> lessonsForSkill = lessonRepository.findBySkillTypeAndLevel(skillType, levelRequired);
                    for (Lesson lesson : lessonsForSkill) {
                        if (!addedLessonIds.contains(lesson.getId())) {
                            recommendedLessons.add(lesson);
                            addedLessonIds.add(lesson.getId());
                            logger.info("Da them bai hoc de xuat cho skill {}: Lesson ID = {}, Tieu de = {}", 
                                       skillType, lesson.getId(), lesson.getTitle());
                        }
                    }
                }
            }
        }

        // 2. Đề xuất bài học phù hợp với skill level
        List<Lesson> levelBasedLessons = lessonRepository.findByLevelOrderByOrderInCourse(levelRequired);
        for (Lesson lesson : levelBasedLessons) {
            if (!addedLessonIds.contains(lesson.getId()) && recommendedLessons.size() < 6) {
                recommendedLessons.add(lesson);
                addedLessonIds.add(lesson.getId());
                logger.info("Da them bai hoc de xuat theo level: Lesson ID = {}, Tieu de = {}", 
                           lesson.getId(), lesson.getTitle());
            }
        }

        // 3. Nếu vẫn chưa đủ, thêm bài học cơ bản
        if (recommendedLessons.size() < 3) {
            List<Lesson> beginnerLessons = lessonRepository.findByLevelOrderByOrderInCourse(Lesson.LevelRequired.BEGINNER);
            for (Lesson lesson : beginnerLessons) {
                if (!addedLessonIds.contains(lesson.getId()) && recommendedLessons.size() < 6) {
                    recommendedLessons.add(lesson);
                    addedLessonIds.add(lesson.getId());
                    logger.info("Da them bai hoc co ban: Lesson ID = {}, Tieu de = {}", 
                               lesson.getId(), lesson.getTitle());
                }
            }
        }

        logger.info("Ket thuc lay bai hoc de xuat dua tren phan tich video cho learnerId: {}. Tong so bai hoc de xuat: {}", 
                   learnerId, recommendedLessons.size());
        return recommendedLessons;
    }

    /**
     * Lấy bài học đề xuất từ video analysis gần nhất
     */
    public List<Lesson> getRecommendedLessonsFromLatestAnalysis(String learnerId) {
        logger.info("Lấy bài học đề xuất từ video analysis gần nhất cho learnerId: {}", learnerId);

        try {
            // Lấy recommendation gần nhất
            Optional<VideoLessonRecommendation> latestRecommendation = 
                videoLessonRecommendationRepository.findFirstByUserIdOrderByCreatedAtDesc(learnerId);

            if (latestRecommendation.isPresent()) {
                VideoLessonRecommendation recommendation = latestRecommendation.get();
                
                // Parse lesson IDs từ JSON string
                List<String> lessonIds = objectMapper.readValue(
                    recommendation.getRecommendedLessonIds(), 
                    new TypeReference<List<String>>() {}
                );

                // Lấy lessons theo IDs
                List<Lesson> lessons = new ArrayList<>();
                for (String lessonIdStr : lessonIds) {
                    try {
                        UUID lessonId = UUID.fromString(lessonIdStr);
                        lessonRepository.findById(lessonId).ifPresent(lessons::add);
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid lesson ID format: {}", lessonIdStr);
                    }
                }

                logger.info("Đã lấy {} bài học đề xuất từ video analysis cho learnerId: {}", 
                           lessons.size(), learnerId);
                return lessons;
            }
        } catch (Exception e) {
            logger.error("Lỗi khi lấy bài học đề xuất từ video analysis cho learnerId {}: {}", 
                        learnerId, e.getMessage());
        }

        // Fallback: lấy bài học đề xuất thông thường
        return getRecommendedLessons(learnerId);
    }

    private Lesson.LevelRequired mapSkillLevelToLevelRequired(String skillLevel) {
        return switch (skillLevel) {
            case "Advanced" -> Lesson.LevelRequired.ADVANCED;
            case "Intermediate" -> Lesson.LevelRequired.INTERMEDIATE;
            case "Beginner" -> Lesson.LevelRequired.BEGINNER;
            default -> Lesson.LevelRequired.INTERMEDIATE;
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
}