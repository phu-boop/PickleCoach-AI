package com.pickle.backend.controller;

import com.pickle.backend.dto.SessionResponseDTO;
import com.pickle.backend.entity.Session;
import com.pickle.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('admin')")
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @GetMapping("/{sessionId}")
    @PreAuthorize("hasRole('admin') or principal.userId == #sessionId")
    public ResponseEntity<Session> getSessionById(@PathVariable String sessionId) {
        Optional<Session> session = sessionService.getSessionById(sessionId);
        return session.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'coach', 'learner')")
    public SessionResponseDTO createSession(@RequestBody Session session) {
        return sessionService.createSession(session);
    }

    @PutMapping("/{sessionId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Session> updateSession(@PathVariable String sessionId, @RequestBody Session sessionDetails) {
        return ResponseEntity.ok(sessionService.updateSession(sessionId, sessionDetails));
    }

    @DeleteMapping("/{sessionId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteSession(@PathVariable String sessionId) {
        sessionService.deleteSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('admin')")
    public List<Session> getSessionsByStatus(@PathVariable Session.Status status) {
        return sessionService.getSessionsByStatus(status);
    }

    @GetMapping("/datetime")
    @PreAuthorize("hasAnyRole('admin', 'coach', 'learner')")
    public List<Session> getSessionsByDateRange(@RequestParam String start, @RequestParam String end) {
        return sessionService.getSessionsByDateRange(start, end);
    }
}