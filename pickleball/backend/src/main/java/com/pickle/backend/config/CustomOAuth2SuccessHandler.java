package com.pickle.backend.config;

import com.pickle.backend.entity.User;
import com.pickle.backend.repository.UserRepository;
import com.pickle.backend.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public CustomOAuth2SuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            System.out.println("OAuth2 Success - Received email: " + email + ", name: " + name);

            if (email == null || name == null) {
                throw new IllegalArgumentException("Email or name not found in OAuth2 response");
            }

            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user = optionalUser.orElseGet(() -> {
                User newUser = new User();
                newUser.setUserId(UUID.randomUUID().toString());
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setPassword(null); // Đặt null thay vì rỗng để tránh vấn đề
                newUser.setRole("USER");
                newUser.setPreferences(""); // Giữ lại vì giờ đã có trường
                newUser.setSkillLevel("");  // Giữ lại vì giờ đã có trường
                System.out.println("Saving new user: " + newUser);
                return userRepository.save(newUser);
            });

            String token = jwtService.generateToken(user.getEmail(), List.of(user.getRole()));
            System.out.println("Generated token for user: " + user.getEmail() + ", token: " + token);
            String successMessage = optionalUser.isPresent() ? "Login successful" : "User registered successfully with ID: " + user.getUserId();

            response.sendRedirect("http://localhost:5173/home?token=" + token + "&role=" + user.getRole() + "&message=" + java.net.URLEncoder.encode(successMessage, "UTF-8"));
        } catch (Exception e) {
            System.err.println("Error in OAuth2 handler: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect("http://localhost:5173/login?error=" + java.net.URLEncoder.encode("Internal server error: " + e.getMessage(), "UTF-8"));
        }
    }
}