package com.pickle.backend.repository.curriculum;

import com.pickle.backend.entity.curriculum.Lesson;
import com.pickle.backend.entity.curriculum.Lesson.LevelRequired;
import com.pickle.backend.entity.curriculum.Lesson.SkillType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByCourseId(long courseId);

    List<Lesson> findByLevelAndSkillType(LevelRequired levelRequired, SkillType skillType);

    List<Lesson> findByLevel(LevelRequired levelRequired);
}
