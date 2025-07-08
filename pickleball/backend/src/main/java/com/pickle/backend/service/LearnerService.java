package com.pickle.backend.service;

import com.pickle.backend.dto.LearnerDTO;
import com.pickle.backend.dto.ScheduleDTO;
import com.pickle.backend.entity.Coach;
import com.pickle.backend.entity.Learner;
import com.pickle.backend.entity.Session;
import com.pickle.backend.entity.User;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.LearnerRepository;
import com.pickle.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearnerService {
    private static final Logger logger = LoggerFactory.getLogger(LearnerService.class);

    @Autowired
    private LearnerRepository learnerRepository;

    @Autowired
    private SessionService sessionService;
    @Autowired
    private UserService userService;

    public List<LearnerDTO> getAllLearners() {
        logger.info("Fetching all learners");
        List<Learner> learners = learnerRepository.findAll();

        return learners.stream().map(learner -> {
            LearnerDTO dto = new LearnerDTO();
            dto.setId(learner.getUserId());
            dto.setSkillLevel(learner.getSkillLevel());
            dto.setGoals(learner.getGoals());
            dto.setProgress(learner.getProgress());
            dto.setUserName(learner.getUser().getName());
            return dto;
        }).collect(Collectors.toList());
    }

    public LearnerDTO getLearnerById(String learnerId) {
        logger.info("Fetching learner with id: {}", learnerId);
        Optional<Learner> learnerOptional = learnerRepository.findById(learnerId);
        if (learnerOptional.isEmpty()) {
            logger.warn("Learner with id: {} not found", learnerId);
            throw new NoSuchElementException("Learner with ID " + learnerId + " not found");
        }
        Learner learner = learnerOptional.get();
        LearnerDTO dto = new LearnerDTO();
        dto.setId(learner.getUserId());
        dto.setSkillLevel(learner.getSkillLevel());
        dto.setGoals(learner.getGoals());
        dto.setProgress(learner.getProgress());
        dto.setUserName(learner.getUser().getName());
        return dto;
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
            foundUser.setRole("learner");
            return learnerRepository.save(newLearner);
        } else {
            logger.warn("Failed to create learner: User not found with ID: {}", learnerDto.getId());
            // Ném ngoại lệ để controller có thể xử lý và trả về 404 Not Found
            throw new ResourceNotFoundException("User not found with ID: " + learnerDto.getId());
        }
    }

    public LearnerDTO updateLearner(String learnerId, LearnerDTO learnerDetails) {
        logger.info("Bắt đầu cập nhật người học với ID: {}", learnerId);
        if (learnerDetails == null) {
            logger.error("Dữ liệu người học gửi lên là null cho ID: {}", learnerId);
            throw new IllegalArgumentException("Dữ liệu người học không được null");
        }
        Learner learner = learnerRepository.findById(learnerId)
                .orElseThrow(() -> {
                    logger.warn("Không tìm thấy người học với ID: {}", learnerId);
                    return new ResourceNotFoundException("Không tìm thấy người học với ID " + learnerId);
                });
        if (learnerDetails.getSkillLevel() != null) {
            learner.setSkillLevel(learnerDetails.getSkillLevel());
        }
        if (learnerDetails.getGoals() != null) {
            learner.setGoals(learnerDetails.getGoals());
        }
        if (learnerDetails.getProgress() != null) {
            learner.setProgress(learnerDetails.getProgress());
        }
        if (learnerDetails.getUserName() != null) {
            learner.getUser().setName(learnerDetails.getUserName());
        }
        Learner updatedLearner = learnerRepository.save(learner);
        logger.info("Đã cập nhật thành công người học với ID: {}", learnerId);
        LearnerDTO result = new LearnerDTO();
        result.setUserName(learner.getUser().getName());
        result.setId(updatedLearner.getUserId());
        result.setSkillLevel(updatedLearner.getSkillLevel());
        result.setGoals(updatedLearner.getGoals());
        result.setProgress(updatedLearner.getProgress());
        result.setUserName(updatedLearner.getUser().getName());
        return result;
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
    public List<ScheduleDTO> getScheduleByleanerId(String learnerId) {
        Optional<Learner> learner = learnerRepository.findById(learnerId);
        if (learner.isPresent()) {
            List<Session> sessions = sessionService.getSessionByLeanerId(learnerId);
            List<ScheduleDTO> scheduleDTOList = new ArrayList<>();

            for (Session session : sessions) {
                String scheduleString = session.getDatetime().toString();
                boolean status = true;
                scheduleDTOList.add(new ScheduleDTO(scheduleString, status));
            }

            return scheduleDTOList;
        } else {
            logger.warn("Learner with id {} not found", learnerId);
            return null;
        }
    }
}