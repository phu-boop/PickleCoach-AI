package com.pickle.backend.dto;

import com.pickle.backend.entity.Debt;
import java.math.BigDecimal;

public class DebtDetailDTO {
    private Long id;
    private BigDecimal amount;
    private DebtDTO.DebtStatus status;

    private CoachDTO coach;
    private LearnerDTO learner;
    private SessionResponseDTO session;

    public DebtDetailDTO(Debt debt) {
        this.id = debt.getId();
        this.amount = debt.getAmount();
        this.status = debt.getStatus();

        // Khởi tạo nested DTO từ entity liên quan
        this.coach = debt.getCoach() != null ? new CoachDTO(debt.getCoach()) : null;
        if(debt.getLearner() != null) {
            System.out.println("okok");
            this.learner = new LearnerDTO();
            this.learner.setUserName(debt.getLearner().getUser().getName());
            this.learner.setGoals(debt.getLearner().getGoals());
            this.learner.setProgress(debt.getLearner().getProgress());
            this.learner.setSkillLevel(debt.getLearner().getSkillLevel());
        }
        this.session = debt.getSession() != null ? new SessionResponseDTO(debt.getSession()) : null;
    }

    // getter và setter cho tất cả trường
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public DebtDTO.DebtStatus getStatus() { return status; }
    public void setStatus(DebtDTO.DebtStatus status) { this.status = status; }

    public CoachDTO getCoach() { return coach; }
    public void setCoach(CoachDTO coach) { this.coach = coach; }

    public LearnerDTO getLearner() { return learner; }
    public void setLearner(LearnerDTO learner) { this.learner = learner; }

    public SessionResponseDTO getSession() { return session; }
    public void setSession(SessionResponseDTO session) { this.session = session; }
}
