package com.pickle.backend.service;

import com.pickle.backend.dto.LearnerDTO;
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

    public Learner createLearner(LearnerDTO learnerDto) { // Đổi tên biến cho rõ ràng
        logger.info("Attempting to create learner for user with ID: {}", learnerDto.getId());

        Optional<User> existingUser = userService.getUserById(learnerDto.getId());

        if (existingUser.isPresent()) {
            User foundUser = existingUser.get();
            logger.info("Found existing user with ID: {}. Proceeding to create learner.", learnerDto.getId());

            Learner newLearner = new Learner();
            newLearner.setUser(foundUser);

            newLearner.setGoals(learnerDto.getGoals());
            newLearner.setSkillLevel(learnerDto.getSkillLevel());
            newLearner.setProgress(learnerDto.getProgress());

            return learnerRepository.save(newLearner);
        } else {
            logger.warn("Failed to create learner: User not found with ID: {}", learnerDto.getId());
            // Ném ngoại lệ để controller có thể xử lý và trả về 404 Not Found
            throw new ResourceNotFoundException("User not found with ID: " + learnerDto.getId());
        }
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