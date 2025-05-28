package com.pickle.backend.service;

import com.pickle.backend.entity.User;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String userId) {
        logger.info("Fetching user with id: {}", userId);
        return userRepository.findById(userId);
    }

    public User createUser(User user) {
        logger.info("Creating user with email: {}", user.getEmail());
        user.setUserId(UUID.randomUUID().toString());
        return userRepository.save(user);
    }

    public User updateUser(String userId, User userDetails) {
        logger.info("Updating user with id: {}", userId);
        return userRepository.findById(userId).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setRole(userDetails.getRole());
            return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    public void deleteUser(String userId) {
        logger.info("Deleting user with id: {}", userId);
        if (!userRepository.existsById(userId)) {
            logger.warn("User with id {} not found", userId);
            throw new ResourceNotFoundException("User not found with id " + userId);
        }
        userRepository.deleteById(userId);
    }

    public Optional<User> findByEmail(String email) {
        logger.info("Fetching user with email: {}", email);
        return userRepository.findByEmail(email);
    }
    @Autowired
    private PasswordEncoder passwordEncoder;
    public User registerUser(String name, String email, String rawPassword) {
        String hashedPassword = passwordEncoder.encode(rawPassword);
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Tạo user mới
        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setName(name);
        user.setEmail(email);
        user.setPassword(hashedPassword); // Sử dụng passwordEncoder đã inject
        user.setRole("USER"); // Hoặc một vai trò mặc định khác, ví dụ "USER" hoặc "ROLE_MEMBER"**
        return userRepository.save(user);
    }
    public boolean checkAccount(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email).orElse(null);
            return (user != null && passwordEncoder.matches(password, user.getPassword()));
        }
        return false;
    }
}