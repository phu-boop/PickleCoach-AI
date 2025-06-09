package com.pickle.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;
    private static final long EXPIRATION_TIME = 86400000; // 1 ngày (ms)
    private final Key key;

    public JwtService(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalArgumentException("JWT secret cannot be null or empty");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.SECRET_KEY = secret;
    }

    public String generateToken(String email, List<String> roles) {
        try {
            System.out.println("Generating token for email: " + email + ", roles: " + roles);
            String token = Jwts.builder()
                    .claims(Map.of("roles", roles))
                    .subject(email)
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .signWith(key)
                    .compact();
            System.out.println("Token generated: " + token);
            return token;
        } catch (Exception e) {
            System.err.println("Error generating token: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.err.println("Error extracting claims from token: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to extract claims from token", e);
        }
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            System.err.println("Error checking token expiration: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to check token expiration", e);
        }
    }

    public boolean validateToken(String token, String email) {
        try {
            final String extractedEmail = extractUsername(token);
            return (extractedEmail.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            System.err.println("Error validating token: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}