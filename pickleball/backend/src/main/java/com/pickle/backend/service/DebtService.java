package com.pickle.backend.service;

import com.pickle.backend.dto.DebtDTO;
import com.pickle.backend.dto.DebtDetailDTO;
import com.pickle.backend.entity.Coach;
import com.pickle.backend.entity.Debt;
import com.pickle.backend.entity.Learner;
import com.pickle.backend.entity.Session;
import com.pickle.backend.repository.CoachRepository;
import com.pickle.backend.repository.DebtRepository;
import com.pickle.backend.repository.LearnerRepository;
import com.pickle.backend.repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DebtService {

    private final DebtRepository debtRepository;
    private final CoachRepository coachRepository;
    private final LearnerRepository learnerRepository;
    private final SessionRepository sessionRepository;

    public DebtService(DebtRepository debtRepository,
                       CoachRepository coachRepository,
                       LearnerRepository learnerRepository,
                       SessionRepository sessionRepository) {
        this.debtRepository = debtRepository;
        this.coachRepository = coachRepository;
        this.learnerRepository = learnerRepository;
        this.sessionRepository = sessionRepository;
    }

    public Debt createDebt(DebtDTO dto) {
        Coach coach = coachRepository.findById(dto.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found with id " + dto.getCoachId()));
        Learner learner = learnerRepository.findById(dto.getLearnerId())
                .orElseThrow(() -> new RuntimeException("Learner not found with id " + dto.getLearnerId()));
        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found with id " + dto.getSessionId()));

        Debt debt = new Debt(coach, learner, session, dto.getAmount(),
                dto.getStatus() != null ? dto.getStatus() : DebtDTO.DebtStatus.PENDING);

        return debtRepository.save(debt);
    }

    public Debt getDebtById(Long id) {
        return debtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Debt not found with id " + id));
    }

    public Debt updateDebt(Long id, DebtDTO dto) {
        Debt debt = getDebtById(id);

        if (dto.getCoachId() != null) {
            Coach coach = coachRepository.findById(dto.getCoachId())
                    .orElseThrow(() -> new RuntimeException("Coach not found with id " + dto.getCoachId()));
            debt.setCoach(coach);
        }

        if (dto.getLearnerId() != null) {
            Learner learner = learnerRepository.findById(dto.getLearnerId())
                    .orElseThrow(() -> new RuntimeException("Learner not found with id " + dto.getLearnerId()));
            debt.setLearner(learner);
        }

        if (dto.getSessionId() != null) {
            Session session = sessionRepository.findById(dto.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found with id " + dto.getSessionId()));
            debt.setSession(session);
        }

        if (dto.getAmount() != null) {
            debt.setAmount(dto.getAmount());
        }

        if (dto.getStatus() != null) {
            debt.setStatus(dto.getStatus());
        }

        return debtRepository.save(debt);
    }

    public void deleteDebt(Long id) {
        Debt debt = getDebtById(id);
        debtRepository.delete(debt);
    }

    public List<Debt> getAllDebts() {
        return debtRepository.findAll();
    }

    public List<DebtDetailDTO> getDebtsByLearnerId(String learnerId) {
        List<Debt> debts = debtRepository.findAllByLearnerUserId(learnerId);
        return debts.stream().map(DebtDetailDTO::new).collect(Collectors.toList());
    }

}
