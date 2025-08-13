package com.pickle.backend.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        return new JwtAuthenticationFilter(secret);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter, CustomOAuth2SuccessHandler customOAuth2SuccessHandler) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/signal/**").permitAll()
                        .requestMatchers("/api/vnpay/**").permitAll()
                        // .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Cho phép tất cả OPTIONS
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/ai/full-analysis").permitAll()
                        .requestMatchers("/images/**", "/uploads/**", "/static/**").permitAll() // Cho phép truy cập static resources
                        .requestMatchers("/api/users/register", "/api/users/login",
                                "/api/users/forgot-password", "/api/users/verify-otp", "/api/users/reset-password", // Thêm các endpoint này
                                "/api/questions/**", "/login/oauth2/code/google", "/api/checkLearnerProgress", "/api/featured-courses" ).permitAll()
                        .requestMatchers("/oauth2/authorization/google","api/courses","/api/mistakes/**","/api/vnpay/payment_return").permitAll()
                        .requestMatchers("/api/sessions/status/**").hasRole("coach")
                        .requestMatchers("/api/users/profile").hasRole("USER")
                        .requestMatchers("/signal/**").permitAll()
                        .requestMatchers("/ws/**","/api/debts/**").permitAll()
                        .requestMatchers("/api/payments",  // Cho phép truy cập không cần xác thực
                    "/api/payments/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(customOAuth2SuccessHandler) // Sử dụng custom handler
                        .failureUrl("/login?error=true")
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Cho phép tất cả origins
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}