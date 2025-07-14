package com.pickle.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.pickle.backend.entity.VideoAnalysis;

public interface VideoAnalysisRepository extends JpaRepository<VideoAnalysis, String> {
    List<VideoAnalysis> findByUserId(String userId);

    @Query("SELECT v FROM VideoAnalysis v WHERE v.shotAnalysis LIKE %?1%")
    List<VideoAnalysis> findByShotAnalysisContaining(String shotType);
}