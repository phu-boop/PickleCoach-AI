package com.pickle.backend.service.curriculum;


import com.pickle.backend.entity.curriculum.LearnerProgress;
import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.repository.curriculum.LearnerProgressRepository;
import com.pickle.backend.repository.curriculum.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CurriculumService {
    @Autowired
    private LearnerProgressRepository learnerProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> getRecommendedLessons(Long learnerId) {
        List<LearnerProgress> progressList = learnerProgressRepository.findIncompleteByLearnerId(learnerId);
        List<Lesson> recommendedLessons = new ArrayList<>();

        // Logic đề xuất: Lấy bài học từ các tiến độ chưa hoàn thành
        for (LearnerProgress progress : progressList) {
            lessonRepository.findById(progress.getLesson().getId()).ifPresent(recommendedLessons::add);
        }

        // Nếu không có bài học chưa hoàn thành, đề xuất bài học đầu tiên của khóa học
        if (recommendedLessons.isEmpty()) {
            lessonRepository.findAll().stream()
                    .filter(lesson -> lesson.getOrderInCourse() == 1)
                    .findFirst()
                    .ifPresent(recommendedLessons::add);
        }

        return recommendedLessons;
    }
}
