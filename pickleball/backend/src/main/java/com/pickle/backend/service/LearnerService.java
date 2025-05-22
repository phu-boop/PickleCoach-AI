package com.pickle.backend.service;

import com.pickle.backend.entity.Learner;
import com.pickle.backend.repository.LearnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearnerService {

    @Autowired
    private LearnerRepository learnerRepository;

    public List<Learner> getAllLearners() {
        return learnerRepository.findAll();
    }

    public Optional<Learner> getLearnerById(String id) {
        return learnerRepository.findById(id);
    }

    public Learner createLearner(Learner learner) {
        return learnerRepository.save(learner);
    }

    public Learner updateLearner(String id, Learner learnerDetails) {
        return learnerRepository.findById(id).map(learner -> {
            learner.setSkillLevel(learnerDetails.getSkillLevel());
            learner.setGoals(learnerDetails.getGoals());
            learner.setProgress(learnerDetails.getProgress());
            return learnerRepository.save(learner);
        }).orElseThrow(() -> new RuntimeException("Learner not found with id " + id));
    }

    public void deleteLearner(String id) {
        learnerRepository.deleteById(id);
    }

    public List<Learner> findBySkillLevel(String skillLevel) {
        return learnerRepository.findBySkillLevel(skillLevel);
    }

    public List<Learner> findByGoalsContaining(String goal) {
        return learnerRepository.findByGoalsContaining(goal);
    }
}
