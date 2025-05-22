package com.pickle.backend.repository;

import com.pickle.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    // Tìm tất cả thanh toán của một user
    List<Payment> findByUserUserId(String userId);

    // Tìm thanh toán theo trạng thái
    List<Payment> findByStatus(Payment.Status status);

    // Tìm thanh toán theo phương thức
    List<Payment> findByMethod(Payment.Method method);
}