package com.pickle.backend.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import static org.mockito.Mockito.*;

@TestConfiguration
public class TestMailConfig {
    @Bean
    public JavaMailSender javaMailSender() {
        return mock(JavaMailSender.class);
    }
}