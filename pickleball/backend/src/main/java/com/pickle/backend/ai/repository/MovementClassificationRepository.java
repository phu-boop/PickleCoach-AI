package com.pickle.backend.ai.repository;

import com.pickle.backend.ai.model.MovementClassification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementClassificationRepository extends JpaRepository<MovementClassification, Long> {
}