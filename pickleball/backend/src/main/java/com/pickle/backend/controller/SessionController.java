package com.pickle.backend.controller;

import com.pickle.backend.entity.Session;
import com.pickle.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/{id}")
    public Optional<Session> getSessionById(@PathVariable String id) {
        return sessionService.getSessionById(id);
    }

    @PostMapping
    public Session createSession(@RequestBody Session session) {
        return sessionService.createSession(session);
    }

    @PutMapping("/{id}")
    public Session updateSession(@PathVariable String id, @RequestBody Session sessionDetails) {
        return sessionService.updateSession(id, sessionDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable String id) {
        sessionService.deleteSession(id);
    }

    @GetMapping("/coach/{coachId}")
    public List<Session> getSessionsByCoach(@PathVariable String coachId) {
        return sessionService.getSessionsByCoach(coachId);
    }

    @GetMapping("/learner/{learnerId}")
    public List<Session> getSessionsByLearner(@PathVariable String learnerId) {
        return sessionService.getSessionsByLearner(learnerId);
    }

    @GetMapping("/status/{status}")
    public List<Session> getSessionsByStatus(@PathVariable Session.Status status) {
        return sessionService.getSessionsByStatus(status);
    }

    @GetMapping("/between")
    public List<Session> getSessionsBetween(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return sessionService.getSessionsBetween(startTime, endTime);
    }
}
