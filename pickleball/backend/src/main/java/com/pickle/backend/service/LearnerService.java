package com.pickle.backend.service;

import com.pickle.backend.entity.Learner;
import com.pickle.backend.entity.User;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.LearnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearnerService {
    private static final Logger logger = LoggerFactory.getLogger(LearnerService.class);

    @Autowired
    private LearnerRepository learnerRepository;

    @Autowired
    private UserService userService;

    public List<Learner> getAllLearners() {
        logger.info("Fetching all learners");
        return learnerRepository.findAll();
    }

    public Optional<Learner> getLearnerById(String learnerId) {
        logger.info("Fetching learner with id: {}", learnerId);
        return learnerRepository.findById(learnerId);
    }

    public Learner createLearner(Learner learner) {
        logger.info("Creating learner for user with email: {}", learner.getUser().getEmail());
        User userDetails = learner.getUser();
        Optional<User> existingUser = userService.findByEmail(userDetails.getEmail());
        User savedUser;

        if (existingUser.isPresent()) {
            logger.info("User with email {} already exists", userDetails.getEmail());
            savedUser = existingUser.get();
        } else {
            logger.info("Creating new user for learner with email: {}", userDetails.getEmail());
            userDetails.setRole("learner");
            savedUser = userService.createUser(userDetails);
        }

        learner.setUser(savedUser);
        learner.setUserId(savedUser.getUserId());
        return learnerRepository.save(learner);
    }

    public Learner updateLearner(String learnerId, Learner learnerDetails) {
        logger.info("Updating learner with id: {}", learnerId);
        return learnerRepository.findById(learnerId).map(learner -> {
            learner.setSkillLevel(learnerDetails.getSkillLevel());
            learner.setGoals(learnerDetails.getGoals());
            learner.setProgress(learnerDetails.getProgress());
            return learnerRepository.save(learner);
        }).orElseThrow(() -> new ResourceNotFoundException("Learner not found with id " + learnerId));
    }

    public void deleteLearner(String learnerId) {
        logger.info("Deleting learner with id: {}", learnerId);
        if (!learnerRepository.existsById(learnerId)) {
            logger.warn("Learner with id {} not found", learnerId);
            throw new ResourceNotFoundException("Learner not found with id " + learnerId);
        }
        learnerRepository.deleteById(learnerId);
    }

    public List<Learner> getLearnersBySkillLevel(String skillLevel) {
        logger.info("Fetching learners with skill level: {}", skillLevel);
        return learnerRepository.findBySkillLevel(skillLevel);
    }

    public List<Learner> getLearnersByGoal(String goal) {
        logger.info("Fetching learners with goal: {}", goal);
        return learnerRepository.findByGoalsContaining(goal);
    }
}