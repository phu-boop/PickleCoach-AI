package com.pickle.backend.repository.curriculum;

import com.pickle.backend.entity.curriculum.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}
