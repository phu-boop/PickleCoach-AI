package com.pickle.backend.service;

import com.pickle.backend.dto.CoachDTO;
import com.pickle.backend.entity.Coach;
import com.pickle.backend.entity.User;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.CoachRepository;
import com.pickle.backend.repository.UserRepository;
import com.pickle.backend.dto.CoachDTO;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CoachService {
    private static final Logger logger = LoggerFactory.getLogger(CoachService.class);

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private UserService userService;

    public String confirmCoachById(String id) {
        Optional<Coach> optionalCoach = coachRepository.findById(id);
        logger.info("start");
        if (optionalCoach.isPresent()) {
            Coach coach = optionalCoach.get();

            User user = coach.getUser();

            user.setRole("coach");

            userRepository.save(user);

            return "Coach confirmed successfully.";
        } else {
            throw new RuntimeException("Coach with ID " + id + " not found.");
        }
    }

    public List<CoachDTO> getAllCoaches() {
        logger.info("Fetching all coaches");

        List<Coach> coaches = coachRepository.findAll();

        for (Coach coach : coaches) {
            coach.getUser().getName();
        }

        return coaches.stream()
                .map(CoachDTO::new)
                .collect(Collectors.toList());
    }

    @Autowired
    private UserRepository userRepository;
    public Optional<Coach> getCoachById(String coachId) {
        logger.info("Fetching coach with id: {}", coachId);
        return coachRepository.findById(coachId);
    }

    @Transactional
    public Coach createCoach(Coach coach) {
        logger.info("Creating coach for user with email: {}", coach.getUser().getEmail());
        User userDetails = coach.getUser();
        Optional<User> existingUser = userService.findByEmail(userDetails.getEmail());

        User savedUser;
        if (existingUser.isPresent()) {
            logger.info("User with email {} already exists, userId: {}", userDetails.getEmail(), existingUser.get().getUserId());
            // Tái truy vấn User để đảm bảo trạng thái managed
            savedUser = userRepository.findByEmail(userDetails.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + userDetails.getEmail()));
        } else {
            logger.info("Creating new user for coach with email: {}", userDetails.getEmail());
            savedUser = userService.createUser(userDetails);
        }

        // Log chi tiết User
        logger.info("User details: userId={}, email={}, name={}, role={}, skillLevel={}, preferences={}",
                savedUser.getUserId(), savedUser.getEmail(), savedUser.getName(),
                savedUser.getRole(), savedUser.getSkillLevel(), savedUser.getPreferences());

        // Kiểm tra userId
        if (savedUser.getUserId() == null) {
            logger.error("User ID is null for email: {}", savedUser.getEmail());
            throw new IllegalStateException("User ID cannot be null");
        }

        // Kiểm tra xem Coach đã tồn tại chưa
        if (coachRepository.existsByUserId(savedUser.getUserId())) {
            logger.warn("Coach already exists for userId: {}", savedUser.getUserId());
            throw new RuntimeException("Coach already exists");
        }
        // sửa role
        savedUser.setRole("verifying");

        // Tạo Coach mới
        Coach newCoach = new Coach();
        newCoach.setUser(savedUser); // Gán User, @MapsId sẽ tự động gán userId
        newCoach.setCertifications(coach.getCertifications());
        newCoach.setAvailability(coach.getAvailability());
        newCoach.setSpecialties(coach.getSpecialties());

        logger.info("Coach before save: userId={}, user.email={}",
                newCoach.getUserId(), newCoach.getUser().getEmail());

        // Lưu Coach
        Coach savedCoach = coachRepository.save(newCoach);
        logger.info("Coach after save: userId={}, user.email={}",
                savedCoach.getUserId(), savedCoach.getUser().getEmail());
        return savedCoach;
    }
    public Coach updateCoach(String coachId, Coach coachDetails) {
        logger.info("Updating coach with id: {}", coachId);
        return coachRepository.findById(coachId).map(coach -> {
            coach.setCertifications(coachDetails.getCertifications());
            coach.setAvailability(coachDetails.getAvailability());
            coach.setSpecialties(coachDetails.getSpecialties());
            return coachRepository.save(coach);
        }).orElseThrow(() -> new ResourceNotFoundException("Coach not found with id " + coachId));
    }

    public void deleteCoach(String coachId) {
        logger.info("Deleting coach with id: {}", coachId);
        if (!coachRepository.existsById(coachId)) {
            logger.warn("Coach with id {} not found", coachId);
            throw new ResourceNotFoundException("Coach not found with id " + coachId);
        }
        coachRepository.deleteById(coachId);
    }

    public List<Coach> getCoachesBySpecialty(String specialty) {
        logger.info("Fetching coaches with specialty: {}", specialty);
        return coachRepository.findBySpecialtiesContaining(specialty);
    }

    public List<Coach> getCoachesByCertification(String certification) {
        logger.info("Fetching coaches with certification: {}", certification);
        return coachRepository.findByCertificationsContaining(certification);
    }
}