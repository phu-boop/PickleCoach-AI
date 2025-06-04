package com.pickle.backend.ai.repository;

import com.pickle.backend.ai.model.PoseAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoseAnalysisRepository extends JpaRepository<PoseAnalysis, Long> {
}