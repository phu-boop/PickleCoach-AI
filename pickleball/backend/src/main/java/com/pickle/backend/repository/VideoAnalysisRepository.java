package com.pickle.backend.repository;

import com.pickle.backend.entity.VideoAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoAnalysisRepository extends JpaRepository<VideoAnalysis, String> {
    // Find all video analyses by learner
    List<VideoAnalysis> findByLearnerUserId(String learnerId);

    // Find video analyses by movement
    List<VideoAnalysis> findByClassifiedMovementsContaining(String movement);
}