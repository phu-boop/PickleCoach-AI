package com.pickle.backend.service.curriculum;

import com.pickle.backend.entity.curriculum.LearnerProgress;
import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.repository.curriculum.LearnerProgressRepository;
import com.pickle.backend.repository.curriculum.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CurriculumService {

    private static final Logger logger = LoggerFactory.getLogger(CurriculumService.class);

    @Autowired
    private LearnerProgressRepository learnerProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

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
    public long getIdProgressByLessonId(UUID lessonId, String learnerId ) {
        return  learnerProgressRepository.findIdByLessonIdAndLearnerId(lessonId,learnerId);
    }
}