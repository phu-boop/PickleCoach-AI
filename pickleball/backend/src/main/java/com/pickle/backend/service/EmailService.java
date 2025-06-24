package com.pickle.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã OTP để đặt lại mật khẩu");
        message.setText("Mã OTP của bạn là: " + otp + ". Vui lòng không chia sẻ mã này.");
        try {
            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email to " + to + ": " + e.getMessage());
        }
    }
}