package com.pickle.backend.service;

import com.pickle.backend.entity.Payment;
import com.pickle.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String paymentId, Payment paymentDetails) {
        return paymentRepository.findById(paymentId).map(payment -> {
            payment.setAmount(paymentDetails.getAmount());
            payment.setStatus(paymentDetails.getStatus());
            payment.setMethod(paymentDetails.getMethod());
            payment.setUser(paymentDetails.getUser());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found with id " + paymentId));
    }

    public void deletePayment(String paymentId) {
        paymentRepository.deleteById(paymentId);
    }

    public List<Payment> getPaymentsByUserId(String userId) {
        return paymentRepository.findByUserUserId(userId);
    }

    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        return paymentRepository.findByStatus(status);
    }

    public List<Payment> getPaymentsByMethod(Payment.Method method) {
        return paymentRepository.findByMethod(method);
    }
}
