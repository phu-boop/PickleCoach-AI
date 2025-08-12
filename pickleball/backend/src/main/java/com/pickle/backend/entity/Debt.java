package com.pickle.backend.entity;

import com.pickle.backend.dto.DebtDTO;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "debts")
public class Debt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DebtDTO.DebtStatus status;

    public Debt() {}

    public Debt(Coach coach, Learner learner, Session session, BigDecimal amount, DebtDTO.DebtStatus status) {
        this.coach = coach;
        this.learner = learner;
        this.session = session;
        this.amount = amount;
        this.status = status;
    }

    // Getter - Setter

    public Long getId() {
        return id;
    }

    public Coach getCoach() {
        return coach;
    }

    public void setCoach(Coach coach) {
        this.coach = coach;
    }

    public Learner getLearner() {
        return learner;
    }

    public void setLearner(Learner learner) {
        this.learner = learner;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public DebtDTO.DebtStatus getStatus() {
        return status;
    }

    public void setStatus(DebtDTO.DebtStatus status) {
        this.status = status;
    }
}
