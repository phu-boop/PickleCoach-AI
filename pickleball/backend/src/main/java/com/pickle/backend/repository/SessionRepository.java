package com.pickle.backend.repository;

import com.pickle.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    List<Session> findByCoachUserId(String coachId);
    List<Session> findByLearnerUserId(String learnerId);
    List<Session> findByStatus(Session.Status status);
    List<Session> findByDatetimeBetween(String start, String end);
}