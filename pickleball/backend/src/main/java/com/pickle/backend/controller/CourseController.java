package com.pickle.backend.controller;

import com.pickle.backend.dto.LearnerProgressDTO;
import com.pickle.backend.dto.LessonDTO;
import com.pickle.backend.entity.curriculum.Course;
import com.pickle.backend.entity.curriculum.LearnerProgress;
import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.repository.curriculum.LearnerProgressRepository;
import com.pickle.backend.service.curriculum.CourseService;
import com.pickle.backend.service.curriculum.CurriculumService;
import com.pickle.backend.service.curriculum.LessonService;
// import com.pickle.backend.service.curriculum.ModuleService; // Bỏ import này
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID; // Vẫn cần nếu LessonDTO dùng UUID, nếu không thì bỏ

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

    // @Autowired(required = false) // Bỏ dòng này
    // private ModuleService moduleService; // Bỏ dòng này

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
    public ResponseEntity<Lesson> getLessonById(@PathVariable UUID id) {
        return lessonService.getLessonById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/learners/{userId}/recommended-lessons")
    public ResponseEntity<List<Lesson>> getRecommendedLessons(@PathVariable String userId) {
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
    public ResponseEntity<Lesson> createLesson(@RequestBody LessonDTO lessonDTO) {
        // Chuyển đổi LessonDTO sang Lesson entity
        Lesson lesson = convertToLessonEntity(lessonDTO);
        Lesson savedLesson = lessonService.saveLesson(lesson);
        return ResponseEntity.ok(savedLesson);
    }

    @PutMapping("/admin/lessons/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable UUID id, @RequestBody LessonDTO lessonDTO) {
        return lessonService.getLessonById(id)
                .map(existingLesson -> {
                    // Cập nhật thông tin từ LessonDTO vào existingLesson
                    updateLessonFromDTO(existingLesson, lessonDTO);
                    Lesson updatedLesson = lessonService.saveLesson(existingLesson);
                    return ResponseEntity.ok(updatedLesson);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID id) {
        return lessonService.getLessonById(id)
                .map(lesson -> {
                    lessonService.deleteLesson(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/learners/{learnerId}/progress")
    public ResponseEntity<List<LearnerProgress>> getLearnerProgress(@PathVariable String learnerId) {
        List<LearnerProgress> progress = learnerProgressRepository.findByLearnerId(learnerId);
        return ResponseEntity.ok(progress);
    }

    // Helper methods for DTO conversion
    private Lesson convertToLessonEntity(LessonDTO lessonDTO) {
        Lesson lesson = new Lesson();

        lesson.setTitle(lessonDTO.getTitle());
        lesson.setDescription(lessonDTO.getDescription());
        lesson.setVideoUrl(lessonDTO.getVideoUrl());
        lesson.setDurationSeconds(lessonDTO.getDurationSeconds());
        lesson.setThumbnailUrl(lessonDTO.getThumbnailUrl());

        // Xử lý SkillType (enum)
        if (lessonDTO.getSkillType() != null && !lessonDTO.getSkillType().isEmpty()) {
            try {
                lesson.setSkillType(Lesson.SkillType.valueOf(lessonDTO.getSkillType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid SkillType received: " + lessonDTO.getSkillType() + " - " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kiểu kỹ năng không hợp lệ: " + lessonDTO.getSkillType());
            }
        } else {
            lesson.setSkillType(null);
        }

        // Xử lý LevelRequired (enum)
        if (lessonDTO.getLevel() != null && !lessonDTO.getLevel().isEmpty()) {
            try {
                lesson.setLevel(Lesson.LevelRequired.valueOf(lessonDTO.getLevel().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid Level received: " + lessonDTO.getLevel() + " - " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cấp độ không hợp lệ: " + lessonDTO.getLevel());
            }
        } else {
            lesson.setLevel(null);
        }

        // Xử lý Course (vẫn bắt buộc)
        if (lessonDTO.getCourseId() != null) {
            courseService.getCourseById(lessonDTO.getCourseId())
                    .ifPresent(lesson::setCourse);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bài học phải thuộc về một khóa học.");
        }

        // Bỏ xử lý Module ở đây vì ModuleService đã được loại bỏ
        lesson.setModule(null); // Luôn đặt module là null nếu không xử lý nó qua DTO này

        // Cập nhật các trường mới thêm vào DTO
        lesson.setOrderInModule(lessonDTO.getOrderInModule());
        lesson.setOrderInCourse(lessonDTO.getOrderInCourse());
        lesson.setContentText(lessonDTO.getContentText());
        lesson.setIsPremium(lessonDTO.getIsPremium());

        return lesson;
    }

    private void updateLessonFromDTO(Lesson existingLesson, LessonDTO lessonDTO) {
        if (lessonDTO.getTitle() != null) {
            existingLesson.setTitle(lessonDTO.getTitle());
        }
        if (lessonDTO.getDescription() != null) {
            existingLesson.setDescription(lessonDTO.getDescription());
        }
        if (lessonDTO.getVideoUrl() != null) {
            existingLesson.setVideoUrl(lessonDTO.getVideoUrl());
        }
        if (lessonDTO.getDurationSeconds() != null) {
            existingLesson.setDurationSeconds(lessonDTO.getDurationSeconds());
        }
        if (lessonDTO.getThumbnailUrl() != null) {
            existingLesson.setThumbnailUrl(lessonDTO.getThumbnailUrl());
        }

        // Xử lý SkillType (enum) khi cập nhật
        if (lessonDTO.getSkillType() != null) {
            if (!lessonDTO.getSkillType().isEmpty()) {
                try {
                    existingLesson.setSkillType(Lesson.SkillType.valueOf(lessonDTO.getSkillType().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid SkillType received during update: " + lessonDTO.getSkillType() + " - " + e.getMessage());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kiểu kỹ năng không hợp lệ khi cập nhật: " + lessonDTO.getSkillType());
                }
            } else {
                existingLesson.setSkillType(null);
            }
        }

        // Xử lý LevelRequired (enum) khi cập nhật
        if (lessonDTO.getLevel() != null) {
            if (!lessonDTO.getLevel().isEmpty()) {
                try {
                    existingLesson.setLevel(Lesson.LevelRequired.valueOf(lessonDTO.getLevel().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    System.err.println("Invalid Level received during update: " + lessonDTO.getLevel() + " - " + e.getMessage());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cấp độ không hợp lệ khi cập nhật: " + lessonDTO.getLevel());
                }
            } else {
                existingLesson.setLevel(null);
            }
        }

        // Xử lý Course khi cập nhật (vẫn bắt buộc)
        if (lessonDTO.getCourseId() != null) {
            courseService.getCourseById(lessonDTO.getCourseId())
                    .ifPresentOrElse(existingLesson::setCourse, () -> {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không tìm thấy khóa học với ID: " + lessonDTO.getCourseId());
                    });
        }
        // Nếu lessonDTO.getCourseId() là null, bạn có thể muốn giữ nguyên course hiện có hoặc ngắt liên kết.
        // Ở đây, tôi giữ nguyên logic cũ là ném lỗi nếu courseId là null khi cập nhật, nhưng bạn có thể thay đổi.

        // Bỏ xử lý Module ở đây vì ModuleService đã được loại bỏ
        existingLesson.setModule(null); // Luôn đặt module là null khi cập nhật nếu không xử lý nó qua DTO này

        // Cập nhật các trường mới thêm vào DTO
        if (lessonDTO.getOrderInModule() != null) {
            existingLesson.setOrderInModule(lessonDTO.getOrderInModule());
        }
        if (lessonDTO.getOrderInCourse() != null) {
            existingLesson.setOrderInCourse(lessonDTO.getOrderInCourse());
        }
        if (lessonDTO.getContentText() != null) {
            existingLesson.setContentText(lessonDTO.getContentText());
        }
        if (lessonDTO.getIsPremium() != null) {
            existingLesson.setIsPremium(lessonDTO.getIsPremium());
        }
    }
}