package com.pickle.backend.controller;

import com.pickle.backend.entity.Learner;
import com.pickle.backend.service.LearnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learners")
public class LearnerController {

    @Autowired
    private LearnerService learnerService;

    @GetMapping
    public List<Learner> getAllLearners() {
        return learnerService.getAllLearners();
    }

    @GetMapping("/{id}")
    public Optional<Learner> getLearnerById(@PathVariable String id) {
        return learnerService.getLearnerById(id);
    }

    @PostMapping
    public Learner createLearner(@RequestBody Learner learner) {
        return learnerService.createLearner(learner);
    }

    @PutMapping("/{id}")
    public Learner updateLearner(@PathVariable String id, @RequestBody Learner learnerDetails) {
        return learnerService.updateLearner(id, learnerDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteLearner(@PathVariable String id) {
        learnerService.deleteLearner(id);
    }

    @GetMapping("/skill/{skillLevel}")
    public List<Learner> findBySkillLevel(@PathVariable String skillLevel) {
        return learnerService.findBySkillLevel(skillLevel);
    }

    @GetMapping("/goal/{goal}")
    public List<Learner> findByGoalsContaining(@PathVariable String goal) {
        return learnerService.findByGoalsContaining(goal);
    }
}
