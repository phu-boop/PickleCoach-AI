package com.pickle.backend.repository.curriculum;

import com.pickle.backend.entity.curriculum.LearnerProgress;
import com.pickle.backend.entity.curriculum.Lesson;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearnerProgressRepository extends JpaRepository<LearnerProgress, Long> {
    List<LearnerProgress> findByLearnerId(String learnerId);

    @Query("SELECT lp FROM LearnerProgress lp WHERE lp.learnerId = :learnerId AND lp.isCompleted = false")
    List<LearnerProgress> findIncompleteByLearnerId(String learnerId);

    @Modifying
    @Transactional
    @Query("UPDATE LearnerProgress lp SET lp.isCompleted = true WHERE lp.id = :id")
    void updateIsCompletedById(Long id);

    boolean existsByLearnerIdAndLessonId(String learnerId, UUID lessonId);

    @Query("SELECT lp.id FROM LearnerProgress lp WHERE lp.lesson.id = :lessonId AND lp.learnerId = :learnerId")
    Long findIdByLessonIdAndLearnerId(@Param("lessonId") UUID lessonId, @Param("learnerId") String learnerId);

    @Query("SELECT lp.id FROM LearnerProgress lp WHERE lp.lesson.id = :lessonId AND lp.learnerId = :learnerId")
    List<Long> findIdsByLessonIdAndLearnerId(@Param("lessonId") UUID lessonId, @Param("learnerId") String learnerId);

    @Modifying
    @Query("DELETE FROM LearnerProgress lp WHERE lp.id IN :ids")
    void deleteByIds(@Param("ids") List<Long> ids);

    @Query("SELECT lp.isCompleted FROM LearnerProgress lp WHERE lp.id = :idProgress")
    Boolean checkCompleted(@Param("idProgress") Long idProgress);


}