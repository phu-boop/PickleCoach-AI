package com.pickle.backend.dto;

import com.pickle.backend.entity.Debt;

import java.math.BigDecimal;

public class DebtDTO {
    private Long id;
    private String coachId;
    private String learnerId;
    private String sessionId;
    private BigDecimal amount;
    private DebtStatus status;

    public DebtDTO(Debt debt) {
        this.id = debt.getId();
        this.coachId = debt.getCoach().getUserId();
        this.learnerId = debt.getLearner().getUserId();
        this.sessionId = debt.getSession().getSessionId();
        this.amount = debt.getAmount();
        this.status = debt.getStatus();
    }

    public enum DebtStatus {
        PENDING,
        PAID,
        CANCELLED
    }

    public DebtStatus getStatus() {
        return status;
    }

    public DebtDTO() {}

    public DebtDTO(Long id, String coachId, String learnerId, String sessionId, BigDecimal amount) {
        this.id = id;
        this.coachId = coachId;
        this.learnerId = learnerId;
        this.sessionId = sessionId;
        this.amount = amount;
    }

    // Getter - Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCoachId() {
        return coachId;
    }

    public void setCoachId(String coachId) {
        this.coachId = coachId;
    }

    public String getLearnerId() {
        return learnerId;
    }

    public void setLearnerId(String learnerId) {
        this.learnerId = learnerId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
