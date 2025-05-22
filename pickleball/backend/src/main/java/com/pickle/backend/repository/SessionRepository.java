package com.pickle.backend.repository;

import com.pickle.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    // Tìm tất cả session của một coach
    List<Session> findByCoachUserId(String coachId);

    // Tìm tất cả session của một learner
    List<Session> findByLearnerUserId(String learnerId);

    // Tìm session theo trạng thái
    List<Session> findByStatus(Session.Status status);

    // Tìm session trong khoảng thời gian
    List<Session> findByDatetimeBetween(LocalDateTime start, LocalDateTime end);
}
