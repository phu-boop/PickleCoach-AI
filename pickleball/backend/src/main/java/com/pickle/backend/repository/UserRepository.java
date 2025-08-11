package com.pickle.backend.repository;

import com.pickle.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findById(String id);
    Optional<Object> findByid(String id);

    // Thêm phương thức đếm tổng số người dùng theo vai trò
    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countUsersByRole();

    // Thêm phương thức đếm tổng số người dùng
    @Query("SELECT COUNT(u) FROM User u")
    Long countTotalUsers();
}