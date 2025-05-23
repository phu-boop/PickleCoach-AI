package com.pickle.backend.controller;

import com.pickle.backend.entity.Learner;
import com.pickle.backend.service.LearnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learners")
public class LearnerController {
    @Autowired
    private LearnerService learnerService;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public List<Learner> getAllLearners() {
        return learnerService.getAllLearners();
    }

    @GetMapping("/{learnerId}")
    @PreAuthorize("hasRole('admin') or principal.userId == #learnerId")
    public ResponseEntity<Learner> getLearnerById(@PathVariable String learnerId) {
        Optional<Learner> learner = learnerService.getLearnerById(learnerId);
        return learner.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public Learner createLearner(@RequestBody Learner learner) {
        return learnerService.createLearner(learner);
    }

    @PutMapping("/{learnerId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Learner> updateLearner(@PathVariable String learnerId, @RequestBody Learner learnerDetails) {
        return ResponseEntity.ok(learnerService.updateLearner(learnerId, learnerDetails));
    }

    @DeleteMapping("/{learnerId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteLearner(@PathVariable String learnerId) {
        learnerService.deleteLearner(learnerId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/skillLevel/{skillLevel}")
    @PreAuthorize("hasAnyRole('admin', 'coach')")
    public List<Learner> getLearnersBySkillLevel(@PathVariable String skillLevel) {
        return learnerService.getLearnersBySkillLevel(skillLevel);
    }

    @GetMapping("/goal/{goal}")
    @PreAuthorize("hasAnyRole('admin', 'coach')")
    public List<Learner> getLearnersByGoal(@PathVariable String goal) {
        return learnerService.getLearnersByGoal(goal);
    }
}