package com.pickle.backend.repository;

import com.pickle.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    List<Session> findByCoachUserId(String coachId);
    List<Session> findByLearnerUserId(String learnerId);
    List<Session> findByStatus(Session.Status status);
    List<Session> findByDatetimeBetween(String start, String end);

    // Thống kê theo ngày
    @Query(value = "SELECT DATE(s.created_at) as booking_date, COUNT(*) as booking_count " +
            "FROM sessions s " +
            "WHERE s.status IN ('COMPLETED', 'IN_PROGRESS', 'SCHEDULED') " +
            "GROUP BY DATE(s.created_at) " +
            "ORDER BY booking_date", nativeQuery = true)
    List<Object[]> getBookingStatsByDay();

    // Thống kê theo tháng
    @Query(value = "SELECT DATE_FORMAT(s.created_at, '%Y-%m') as booking_month, COUNT(*) as booking_count " +
            "FROM sessions s " +
            "WHERE s.status IN ('COMPLETED', 'IN_PROGRESS', 'SCHEDULED') " +
            "GROUP BY DATE_FORMAT(s.created_at, '%Y-%m') " +
            "ORDER BY booking_month", nativeQuery = true)
    List<Object[]> getBookingStatsByMonth();

    // Thống kê theo năm
    @Query(value = "SELECT YEAR(s.created_at) as booking_year, COUNT(*) as booking_count " +
            "FROM sessions s " +
            "WHERE s.status IN ('COMPLETED', 'IN_PROGRESS', 'SCHEDULED') " +
            "GROUP BY YEAR(s.created_at) " +
            "ORDER BY booking_year", nativeQuery = true)
    List<Object[]> getBookingStatsByYear();
}