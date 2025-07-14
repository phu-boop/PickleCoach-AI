package com.pickle.backend.service.curriculum;


import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.repository.curriculum.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Service
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Optional<Lesson> getLessonById(UUID id) {
        return lessonRepository.findById(id);
    }

    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(UUID id) {
        lessonRepository.deleteById(id);
    }

    public List<Lesson> getLessonByIdCourse(long courseId){ return lessonRepository.findByCourseId(courseId);}
}
