package com.pickle.backend.repository;

import com.pickle.backend.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizResultsRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByLearnerIdOrderByCreatedAtDesc(String learnerId);
}