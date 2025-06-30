package com.pickle.backend.service;

import com.pickle.backend.dto.SessionResponseDTO;
import com.pickle.backend.entity.Session;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.CoachRepository;
import com.pickle.backend.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {
    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private CoachRepository coachRepository; // Thay CoachService bằng CoachRepository

    public List<Session> getAllSessions() {
        logger.info("Fetching all sessions");
        return sessionRepository.findAll();
    }

    public Optional<Session> getSessionById(String sessionId) {
        logger.info("Fetching session with id: {}", sessionId);
        return sessionRepository.findById(sessionId);
    }

    public List<Session> getSessionByCoachId(String coachId) {
        logger.info("Fetching session with CoachId: {}", coachId);
        return sessionRepository.findByCoachUserId(coachId);
    }

    public SessionResponseDTO createSession(Session session) {
        logger.info("Creating session with coach: {} at {}",
                session.getCoach().getUserId(), session.getDatetime());
        // Kiểm tra huấn luyện viên bằng CoachRepository
        coachRepository.findById(session.getCoach().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Coach not found with id " + session.getCoach().getUserId()));
        session.setSessionId(UUID.randomUUID().toString());
        Session savedSession = sessionRepository.save(session);
        return new SessionResponseDTO(savedSession);
    }

    public Session updateSession(String sessionId, Session sessionDetails) {
        logger.info("Updating session with id: {}", sessionId);
        return sessionRepository.findById(sessionId).map(session -> {
            session.setCoach(sessionDetails.getCoach());
            session.setLearner(sessionDetails.getLearner());
            session.setDatetime(sessionDetails.getDatetime());
            session.setStatus(sessionDetails.getStatus());
            session.setVideoLink(sessionDetails.getVideoLink());
            session.setFeedback(sessionDetails.getFeedback());
            return sessionRepository.save(session);
        }).orElseThrow(() -> new ResourceNotFoundException("Session not found with id " + sessionId));
    }

    public void deleteSession(String sessionId) {
        logger.info("Deleting session with id: {}", sessionId);
        if (!sessionRepository.existsById(sessionId)) {
            logger.warn("Session with id {} not found", sessionId);
            throw new ResourceNotFoundException("Session not found with id " + sessionId);
        }
        sessionRepository.deleteById(sessionId);
    }

    public List<Session> getSessionsByStatus(Session.Status status) {
        logger.info("Fetching sessions with status: {}", status);
        return sessionRepository.findByStatus(status);
    }

    public List<Session> getSessionsByDateRange(String start, String end) {
        logger.info("Fetching sessions between {} and {}", start, end);
        return sessionRepository.findByDatetimeBetween(start, end);
    }
}