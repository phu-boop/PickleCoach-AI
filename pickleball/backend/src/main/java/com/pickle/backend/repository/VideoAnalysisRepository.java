package com.pickle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.pickle.backend.entity.VideoAnalysis;

public interface VideoAnalysisRepository extends JpaRepository<VideoAnalysis, String> {
    // Tìm theo learnerId (UUID)
    List<VideoAnalysis> findByLearnerId(String learnerId);

    // Tìm theo classifiedMovements chứa chuỗi
    @Query("SELECT v FROM VideoAnalysis v WHERE v.classifiedMovements LIKE %?1%")
    List<VideoAnalysis> findByClassifiedMovementsContaining(String keyword);
}
