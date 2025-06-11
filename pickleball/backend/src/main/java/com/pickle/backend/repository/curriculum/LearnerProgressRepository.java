package com.pickle.backend.repository.curriculum;

import com.pickle.backend.entity.curriculum.LearnerProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearnerProgressRepository extends JpaRepository<LearnerProgress, Long> {
    List<LearnerProgress> findByLearnerId(Long learnerId);

    @Query("SELECT lp FROM LearnerProgress lp WHERE lp.learnerId = :learnerId AND lp.isCompleted = false")
    List<LearnerProgress> findIncompleteByLearnerId(Long learnerId);
}