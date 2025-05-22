package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
public class Payment {
    @Id
    @Column(name = "paymentId", nullable = false)
    private String paymentId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Column(name = "amount")
    private Float amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Method method;

    public enum Status {
        pending, completed, failed
    }

    public enum Method {
        credit_card, paypal, cash
    }
}
