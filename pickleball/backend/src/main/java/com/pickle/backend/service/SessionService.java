package com.pickle.backend.service;

import com.pickle.backend.entity.Session;
import com.pickle.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Optional<Session> getSessionById(String id) {
        return sessionRepository.findById(id);
    }

    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }

    public Session updateSession(String id, Session sessionDetails) {
        return sessionRepository.findById(id).map(session -> {
            session.setCoach(sessionDetails.getCoach());
            session.setLearner(sessionDetails.getLearner());
            session.setDatetime(sessionDetails.getDatetime());
            session.setStatus(sessionDetails.getStatus());
            session.setVideoLink(sessionDetails.getVideoLink());
            session.setFeedback(sessionDetails.getFeedback());
            return sessionRepository.save(session);
        }).orElseThrow(() -> new RuntimeException("Session not found with id " + id));
    }

    public void deleteSession(String id) {
        sessionRepository.deleteById(id);
    }

    public List<Session> getSessionsByCoach(String coachId) {
        return sessionRepository.findByCoachUserId(coachId);
    }

    public List<Session> getSessionsByLearner(String learnerId) {
        return sessionRepository.findByLearnerUserId(learnerId);
    }

    public List<Session> getSessionsByStatus(Session.Status status) {
        return sessionRepository.findByStatus(status);
    }

    public List<Session> getSessionsBetween(LocalDateTime start, LocalDateTime end) {
        return sessionRepository.findByDatetimeBetween(start, end);
    }
}
