package com.pickle.backend.controller;

import com.pickle.backend.entity.Payment;
import com.pickle.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('admin') or principal.userId == #paymentId")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String paymentId) {
        Optional<Payment> payment = paymentService.getPaymentById(paymentId);
        return payment.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'learner')")
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @PutMapping("/{paymentId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Payment> updatePayment(@PathVariable String paymentId, @RequestBody Payment paymentDetails) {
        return ResponseEntity.ok(paymentService.updatePayment(paymentId, paymentDetails));
    }

    @DeleteMapping("/{paymentId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deletePayment(@PathVariable String paymentId) {
        paymentService.deletePayment(paymentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('admin')")
    public List<Payment> getPaymentsByStatus(@PathVariable Payment.Status status) {
        return paymentService.getPaymentsByStatus(status);
    }

    @GetMapping("/method/{method}")
    @PreAuthorize("hasRole('admin')")
    public List<Payment> getPaymentsByMethod(@PathVariable Payment.Method method) {
        return paymentService.getPaymentsByMethod(method);
    }
}