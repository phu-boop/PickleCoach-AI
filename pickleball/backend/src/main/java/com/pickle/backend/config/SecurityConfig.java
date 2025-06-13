package com.pickle.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
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

    // private final JwtAuthenticationFilter jwtAuthenticationFilter;
    // private final CustomOAuth2SuccessHandler oAuth2SuccessHandler;

    // public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
    // CustomOAuth2SuccessHandler oAuth2SuccessHandler) {
    // this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    // this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    // }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        return new JwtAuthenticationFilter(secret);
    }

    @Profile("test")
    @Bean
    public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    @Profile("!test")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Cho phép tất cả OPTIONS
                        .requestMatchers("/api/ai/full-analysis").permitAll()
                        .requestMatchers("/api/users/register", "/api/users/login", "/api/questions/**",
                                "/login/oauth2/code/google", "/api/questions/**")
                        .permitAll()
                        .requestMatchers("/api/users/profile").hasRole("USER")
                        .requestMatchers("/api/users/**").hasRole("admin")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2 -> oauth2.disable())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "*")); // Thêm "*" cho test
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http,
// JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
// http
// .cors(cors -> cors.configurationSource(corsConfigurationSource()))
// .csrf(csrf -> csrf.disable())
// .sessionManagement(session ->
// session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/api/ai/full-analysis").permitAll()
// .requestMatchers("/api/users/register", "/api/users/login",
// "/api/questions/**", "/login/oauth2/code/google").permitAll()
// .requestMatchers("/api/users/profile").hasRole("USER")
// .requestMatchers("/api/users/**").hasRole("admin")
// .anyRequest().authenticated()
// // .requestMatchers(HttpMethod.POST, "/api/ai/full-analysis").permitAll()
// // .requestMatchers("/api/users/register", "/api/users/login",
// "/api/questions/**").permitAll()
// // .requestMatchers("/api/users/profile").hasRole("USER")
// // .requestMatchers("/api/users/**").hasRole("admin")
// // .anyRequest().authenticated()
// )
// .addFilterBefore(jwtAuthenticationFilter,
// UsernamePasswordAuthenticationFilter.class)
// // .oauth2Login(oauth2 -> oauth2
// // .loginProcessingUrl("/login/oauth2/code/google")
// // .successHandler(oAuth2SuccessHandler)
// // .failureUrl("/login?error=true") // Xử lý lỗi OAuth2
// // )
// .oauth2Login(oauth2 -> oauth2.disable())
// .logout(logout -> logout
// .logoutUrl("/logout")
// .logoutSuccessUrl("/")
// .permitAll()
// );
// // .exceptionHandling(exception -> exception
// // .accessDeniedPage("/access-denied") // Trang lỗi tùy chỉnh
// // );

// return http.build();
// }