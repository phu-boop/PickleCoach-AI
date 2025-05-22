package com.pickle.backend.repository;

import com.pickle.backend.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CoachRepository extends JpaRepository<Coach, String> {
    // Tìm tất cả coach theo chuyên môn
    List<Coach> findBySpecialtiesContaining(String specialty);

    // Tìm coach theo chứng chỉ
    List<Coach> findByCertificationsContaining(String certification);
}