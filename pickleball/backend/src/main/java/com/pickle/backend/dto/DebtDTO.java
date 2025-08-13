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
    private Method method;

    // Enum definitions
    public enum DebtStatus {
        PENDING,
        PAID,
        CANCELLED
    }

    public enum Method {
        CREDIT_CARD,
        PAYPAL,
        BANK_TRANSFER
    }

    // Constructors
    public DebtDTO() {
        this.status = DebtStatus.PENDING; // Default value
    }

    public DebtDTO(Long id, String coachId, String learnerId, String sessionId, BigDecimal amount) {
        this();
        this.id = id;
        this.coachId = coachId;
        this.learnerId = learnerId;
        this.sessionId = sessionId;
        this.amount = amount;
    }

    public DebtDTO(Debt debt) {
        this();
        this.id = debt.getId();
        this.coachId = debt.getCoach().getUserId();
        this.learnerId = debt.getLearner().getUserId();
        this.sessionId = debt.getSession().getSessionId();
        this.amount = debt.getAmount();
        this.status = debt.getStatus();
        this.method = debt.getMethod(); // Make sure Debt entity has getMethod()
    }

    // Getters and Setters
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

    public DebtStatus getStatus() {
        return status;
    }

    public void setStatus(DebtStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Debt status cannot be null");
        }
        this.status = status;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        // Only validate method when status is PAID
        if (this.status == DebtStatus.PAID && method == null) {
            throw new IllegalArgumentException("Payment method is required when status is PAID");
        }
        this.method = method;
    }

    // Utility methods
    @Override
    public String toString() {
        return "DebtDTO{" +
                "id=" + id +
                ", coachId='" + coachId + '\'' +
                ", learnerId='" + learnerId + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", amount=" + amount +
                ", status=" + status +
                ", method=" + method +
                '}';
    }
}