package com.pickle.backend.repository.curriculum;

import java.util.List;

import com.pickle.backend.entity.curriculum.Course;
import com.pickle.backend.entity.curriculum.Course.LevelRequired;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByLevelRequired(LevelRequired levelRequired);
    List<Course> findByTitleIn(List<String> titles);
}
