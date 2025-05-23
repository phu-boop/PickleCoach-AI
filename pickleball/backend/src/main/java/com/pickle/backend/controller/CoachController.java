package com.pickle.backend.controller;

import com.pickle.backend.entity.Coach;
import com.pickle.backend.service.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {
    @Autowired
    private CoachService coachService;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public List<Coach> getAllCoaches() {
        return coachService.getAllCoaches();
    }

    @GetMapping("/{coachId}")
    @PreAuthorize("hasRole('admin') or principal.userId == #coachId")
    public ResponseEntity<Coach> getCoachById(@PathVariable String coachId) {
        Optional<Coach> coach = coachService.getCoachById(coachId);
        return coach.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public Coach createCoach(@RequestBody Coach coach) {
        return coachService.createCoach(coach);
    }

    @PutMapping("/{coachId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Coach> updateCoach(@PathVariable String coachId, @RequestBody Coach coachDetails) {
        return ResponseEntity.ok(coachService.updateCoach(coachId, coachDetails));
    }

    @DeleteMapping("/{coachId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteCoach(@PathVariable String coachId) {
        coachService.deleteCoach(coachId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/specialty/{specialty}")
    @PreAuthorize("hasAnyRole('admin', 'learner')")
    public List<Coach> getCoachesBySpecialty(@PathVariable String specialty) {
        return coachService.getCoachesBySpecialty(specialty);
    }

    @GetMapping("/certification/{certification}")
    @PreAuthorize("hasAnyRole('admin', 'learner')")
    public List<Coach> getCoachesByCertification(@PathVariable String certification) {
        return coachService.getCoachesByCertification(certification);
    }
}