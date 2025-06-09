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

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setUserId(UUID.randomUUID().toString());
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(""); // Không cần mật khẩu cho Google login
            newUser.setRole("USER");
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user.getEmail(), List.of(user.getRole()));

        // ⚠️ Redirect đến đúng route frontend
        response.sendRedirect("http://localhost:5173/oauth2/redirect?token=" + token + "&role=" + user.getRole());
    }
}