package com.pickle.backend.service;

import com.pickle.backend.dto.DebtDTO;
import com.pickle.backend.dto.LearnerDTO;
import com.pickle.backend.dto.SessionResponseDTO;
import com.pickle.backend.entity.Coach;
import com.pickle.backend.entity.Debt;
import com.pickle.backend.entity.Learner;
import com.pickle.backend.entity.Session;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.CoachRepository;
import com.pickle.backend.repository.DebtRepository;
import com.pickle.backend.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.support.SessionStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SessionService {
    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private CoachRepository coachRepository; // Thay CoachService bằng CoachRepository

    @Autowired
    private DebtRepository debtRepository;

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

    public List<Session> getSessionByLeanerId(String learnerId) {
        logger.info("Fetching session with LeanerId: {}", learnerId);
        return sessionRepository.findByLearnerUserId(learnerId);
    }

    public SessionResponseDTO createSession(Session session) {
        logger.info("Creating session with coach: {} at {}",
                session.getCoach().getUserId(), session.getDatetime());

        // Kiểm tra tồn tại coach
        coachRepository.findById(session.getCoach().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Coach not found with id " + session.getCoach().getUserId()));

        // Tạo id session
        session.setSessionId(UUID.randomUUID().toString());
        Session savedSession = sessionRepository.save(session);

        // Tạo công nợ mặc định
        Debt debt = new Debt();
        debt.setCoach(savedSession.getCoach());
        debt.setLearner(savedSession.getLearner());
        debt.setSession(savedSession);
        Coach coach = coachRepository.findCoachByUserId(session.getCoach().getUserId());
        if(coach.getLevel() != null) {
            switch(coach.getLevel()) {
                case BEGINNER: debt.setAmount(BigDecimal.valueOf(3000000)); break;
                case INTERMEDIATE: debt.setAmount(BigDecimal.valueOf(9000000)); break;
                case ADVANCED: debt.setAmount(BigDecimal.valueOf(15000000)); break;
                default: debt.setAmount(BigDecimal.ZERO);
            }
        } else {
            debt.setAmount(BigDecimal.ZERO);
        }
        debt.setStatus(DebtDTO.DebtStatus.PENDING);

        debtRepository.save(debt);

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
    public Session updateStatusSession(String sessionId) {
        logger.info("Updating status session with id: {}", sessionId);
        return sessionRepository.findById(sessionId).map(session -> {
            session.setStatus(Session.Status.valueOf("IN_PROGRESS"));
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

    public List<LearnerDTO> getLearnerByCoach(String coachId) {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.info("Fetching sessions with CoachId: {}", coachId);

        List<Session> sessions = sessionRepository.findByCoachUserId(coachId);

        List<LearnerDTO> learnerDTOs = sessions.stream()
                .map(Session::getLearner)
                .filter(learner -> learner != null)
                .map(this::convertToLearnerDTO)
                .collect(Collectors.toList());

        logger.info("Found {} learners for coachId: {}", learnerDTOs.size(), coachId);
        return learnerDTOs;
    }
    private LearnerDTO convertToLearnerDTO(Learner learner) {
        LearnerDTO dto = new LearnerDTO();
        dto.setId(learner.getUserId());
        dto.setUserName(learner.getUser().getName());
        dto.setSkillLevel(learner.getSkillLevel());
        dto.setGoals(learner.getGoals());
        dto.setProgress(learner.getProgress());
        return dto;
    }
    private SessionResponseDTO convertToSessionResponseDTO(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO(session);
        return dto;
    }
    public List<SessionResponseDTO> getSessionBycoachId(String coachId) {
        logger.info("Fetching sessions with CoachId: {}", coachId);
        List<Session> sessions = sessionRepository.findByCoachUserId(coachId);
        return  sessions.stream().map(this::convertToSessionResponseDTO).collect(Collectors.toList());
    }
}