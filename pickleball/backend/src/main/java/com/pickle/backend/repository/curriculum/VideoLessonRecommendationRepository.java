package com.pickle.backend.repository.curriculum;

import com.pickle.backend.entity.curriculum.VideoLessonRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VideoLessonRecommendationRepository extends JpaRepository<VideoLessonRecommendation, UUID> {
    Optional<VideoLessonRecommendation> findByUserId(String userId);
    List<VideoLessonRecommendation> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<VideoLessonRecommendation> findFirstByUserIdOrderByCreatedAtDesc(String userId);
}
