package com.pickle.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendOtpEmail(String to, String otp) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Mã OTP để đặt lại mật khẩu");

            // Chuẩn bị context Thymeleaf
            Context context = new Context();
            context.setVariable("otp", otp);

            // Gán CID logo
            context.setVariable("logoCid", "logoImage");

            // Render HTML template
            String htmlContent = templateEngine.process("otp-email", context);
            helper.setText(htmlContent, true); // Enable HTML content

            // Đính kèm logo từ static folder dưới dạng inline (CID)
            helper.addInline("logoImage", new ClassPathResource("static/images/logo.png"));

            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send OTP email to " + to + ": " + e.getMessage());
        }
    }
}
