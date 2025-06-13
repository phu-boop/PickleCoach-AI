package com.pickle.backend.controller;


import com.pickle.backend.dto.LearnerProgressDTO;
import com.pickle.backend.entity.curriculum.Course;
import com.pickle.backend.entity.curriculum.LearnerProgress;
import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.repository.curriculum.LearnerProgressRepository;
import com.pickle.backend.service.curriculum.CourseService;
import com.pickle.backend.service.curriculum.CurriculumService;
import com.pickle.backend.service.curriculum.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private CurriculumService curriculumService;

    @Autowired
    private LearnerProgressRepository learnerProgressRepository;

    // User endpoints (đã có từ trước)
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        return lessonService.getLessonById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/learners/{userId}/recommended-lessons")
    public ResponseEntity<List<Lesson>> getRecommendedLessons(@PathVariable Long userId) {
        List<Lesson> recommendedLessons = curriculumService.getRecommendedLessons(userId);
        return ResponseEntity.ok(recommendedLessons);
    }

    @PostMapping("/learner-progress")
    public ResponseEntity<LearnerProgress> updateLearnerProgress(@RequestBody LearnerProgressDTO progressDTO) {
        LearnerProgress progress = new LearnerProgress();
        progress.setLearnerId(progressDTO.getLearnerId());
        progress.setLesson(lessonService.getLessonById(progressDTO.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found")));
        progress.setIsCompleted(progressDTO.getIsCompleted());
        progress.setWatchedDurationSeconds(progressDTO.getWatchedDurationSeconds());
        progress.setLastWatchedAt(LocalDateTime.now());

        LearnerProgress savedProgress = learnerProgressRepository.save(progress);
        return ResponseEntity.ok(savedProgress);
    }

    // Admin endpoints
    @GetMapping("/admin/courses")
    public ResponseEntity<List<Course>> getAllCoursesAdmin() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/admin/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseService.saveCourse(course);
        return ResponseEntity.ok(savedCourse);
    }

    @PutMapping("/admin/courses/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return courseService.getCourseById(id)
                .map(existingCourse -> {
                    course.setId(id);
                    Course updatedCourse = courseService.saveCourse(course);
                    return ResponseEntity.ok(updatedCourse);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> {
                    courseService.deleteCourse(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/lessons")
    public ResponseEntity<List<Lesson>> getAllLessonsAdmin() {
        List<Lesson> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/admin/lessons")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson savedLesson = lessonService.saveLesson(lesson);
        return ResponseEntity.ok(savedLesson);
    }

    @PutMapping("/admin/lessons/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        return lessonService.getLessonById(id)
                .map(existingLesson -> {
                    lesson.setId(id);
                    Lesson updatedLesson = lessonService.saveLesson(lesson);
                    return ResponseEntity.ok(updatedLesson);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        return lessonService.getLessonById(id)
                .map(lesson -> {
                    lessonService.deleteLesson(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/learners/{learnerId}/progress")
    public ResponseEntity<List<LearnerProgress>> getLearnerProgress(@PathVariable Long learnerId) {
        List<LearnerProgress> progress = learnerProgressRepository.findByLearnerId(learnerId);
        return ResponseEntity.ok(progress);
    }

}