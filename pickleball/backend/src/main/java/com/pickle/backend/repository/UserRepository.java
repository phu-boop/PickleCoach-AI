package com.pickle.backend.repository;

import com.pickle.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
//import java.util.UUID;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}