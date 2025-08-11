package com.pickle.backend.repository;

import com.pickle.backend.entity.Learner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearnerRepository extends JpaRepository<Learner, String> {
    List<Learner> findBySkillLevel(String skillLevel);
    List<Learner> findByGoalsContaining(String goal);
}