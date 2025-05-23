package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @Column(name = "paymentId", nullable = false)
    private String paymentId;

    @NotNull(message = "User is mandatory")
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positive")
    @Column(name = "amount")
    private BigDecimal amount;

    @NotNull(message = "Status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @NotNull(message = "Method is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Method method;

    public enum Status {
        PENDING,
        COMPLETED,
        FAILED
    }

    public enum Method {
        CREDIT_CARD,
        PAYPAL,
        BANK_TRANSFER
    }
}