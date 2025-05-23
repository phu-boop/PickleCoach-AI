package com.pickle.backend.service;

import com.pickle.backend.entity.Payment;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        logger.info("Fetching all payments");
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(String paymentId) {
        logger.info("Fetching payment with id: {}", paymentId);
        return paymentRepository.findById(paymentId);
    }

    public Payment createPayment(Payment payment) {
        logger.info("Creating payment for user: {}", payment.getUser().getUserId());
        payment.setPaymentId(UUID.randomUUID().toString());
        return paymentRepository.save(payment);
    }

    public Payment updatePayment(String paymentId, Payment paymentDetails) {
        logger.info("Updating payment with id: {}", paymentId);
        return paymentRepository.findById(paymentId).map(payment -> {
            payment.setAmount(paymentDetails.getAmount());
            payment.setStatus(paymentDetails.getStatus());
            payment.setMethod(paymentDetails.getMethod());
            payment.setUser(paymentDetails.getUser());
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + paymentId));
    }

    public void deletePayment(String paymentId) {
        logger.info("Deleting payment with id: {}", paymentId);
        if (!paymentRepository.existsById(paymentId)) {
            logger.warn("Payment with id {} not found", paymentId);
            throw new ResourceNotFoundException("Payment not found with id " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }

    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        logger.info("Fetching payments with status: {}", status);
        return paymentRepository.findByStatus(status);
    }

    public List<Payment> getPaymentsByMethod(Payment.Method method) {
        logger.info("Fetching payments with method: {}", method);
        return paymentRepository.findByMethod(method);
    }
}