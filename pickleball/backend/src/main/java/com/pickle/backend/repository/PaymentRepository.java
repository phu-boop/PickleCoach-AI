package com.pickle.backend.repository;

import com.pickle.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByUserUserId(String userId);
    List<Payment> findByStatus(Payment.Status status);
    List<Payment> findByMethod(Payment.Method method);
}