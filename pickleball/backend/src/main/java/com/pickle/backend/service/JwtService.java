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
<<<<<<< HEAD

    private static final long EXPIRATION_TIME = 86400000; // 1 ngày
=======
    private static final long EXPIRATION_TIME = 86400000; // 1 ngày (ms)
    private final Key key;
>>>>>>> 02cd8ffab014e0c35b42a1fd345f2cb5d7a21aa5

    public JwtService(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalArgumentException("JWT secret cannot be null or empty");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.SECRET_KEY = secret;
    }

    public String generateToken(String email, List<String> roles) {
        return Jwts.builder()
                .claims(Map.of("roles", roles))
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

<<<<<<< HEAD
    // Trích xuất username (email) từ token
=======
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

>>>>>>> 02cd8ffab014e0c35b42a1fd345f2cb5d7a21aa5
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractUsername(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
}