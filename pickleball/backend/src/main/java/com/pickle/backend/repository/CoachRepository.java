package com.pickle.backend.repository;

import com.pickle.backend.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, String> {
    List<Coach> findBySpecialtiesContaining(String specialty);
    List<Coach> findByCertificationsContaining(String certification);
    Optional<Coach> findById(String id);
    boolean existsByUserId(String userId);
}