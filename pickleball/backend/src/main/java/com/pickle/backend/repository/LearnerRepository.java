package com.pickle.backend.repository;

import com.pickle.backend.entity.Learner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearnerRepository extends JpaRepository<Learner, String> {
    // Tìm learner theo cấp độ kỹ năng
    List<Learner> findBySkillLevel(String skillLevel);

    // Tìm learner theo mục tiêu
    List<Learner> findByGoalsContaining(String goal);
}