package com.pickle.backend.service;

import com.pickle.backend.entity.Coach;
import com.pickle.backend.entity.User;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.CoachRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoachService {
    private static final Logger logger = LoggerFactory.getLogger(CoachService.class);

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private UserService userService;

    public List<Coach> getAllCoaches() {
        logger.info("Fetching all coaches");
        return coachRepository.findAll();
    }

    public Optional<Coach> getCoachById(String coachId) {
        logger.info("Fetching coach with id: {}", coachId);
        return coachRepository.findById(coachId);
    }

    public Coach createCoach(Coach coach) {
        logger.info("Creating coach for user with email: {}", coach.getUser().getEmail());
        User userDetails = coach.getUser();
        Optional<User> existingUser = userService.findByEmail(userDetails.getEmail());
        User savedUser;

        if (existingUser.isPresent()) {
            logger.info("User with email {} already exists", userDetails.getEmail());
            savedUser = existingUser.get();
        } else {
            logger.info("Creating new user for coach with email: {}", userDetails.getEmail());
            userDetails.setRole("coach");
            savedUser = userService.createUser(userDetails);
        }

        coach.setUser(savedUser);
        coach.setUserId(savedUser.getUserId());
        return coachRepository.save(coach);
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