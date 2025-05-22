package com.pickle.backend.repository;

import com.pickle.backend.entity.VideoAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoAnalysisRepository extends JpaRepository<VideoAnalysis, String> {
    // Tìm tất cả video analysis của một learner
    List<VideoAnalysis> findByLearnerUserId(String learnerId);

    // Tìm video analysis theo loại chuyển động
    List<VideoAnalysis> findByClassifiedMovementsContaining(String movement);
}