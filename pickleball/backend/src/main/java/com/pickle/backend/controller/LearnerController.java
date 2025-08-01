package com.pickle.backend.controller;

import com.pickle.backend.dto.LearnerDTO;
import com.pickle.backend.dto.ScheduleDTO;
import com.pickle.backend.entity.Learner;
import com.pickle.backend.service.LearnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learners")
public class LearnerController {
    @Autowired
    private LearnerService learnerService;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public List<LearnerDTO> getAllLearners() {
        return learnerService.getAllLearners();
    }
    @GetMapping("/{learnerId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<LearnerDTO> getLearnerById(@PathVariable String learnerId) {
        LearnerDTO learner = learnerService.getLearnerById(learnerId);
        if (learner == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(learner);
    }

    @PostMapping
    public Learner createLearner(@RequestBody LearnerDTO Learner) {
        return learnerService.createLearner(Learner);
    }

    @PutMapping("/{learnerId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<LearnerDTO> updateLearner(@PathVariable String learnerId, @RequestBody LearnerDTO learnerDetails) {
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

    @GetMapping("/schedule/{leanerId}")
    @PreAuthorize("hasAnyRole('admin', 'learner')")
    public ResponseEntity<List<ScheduleDTO>> getScheduleByCoaches(@PathVariable String leanerId) {
        List<ScheduleDTO> schedule = learnerService.getScheduleByleanerId(leanerId);
        return schedule != null ? ResponseEntity.ok(schedule) : ResponseEntity.notFound().build();
    }
}