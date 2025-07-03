package com.pickle.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Key;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final String HEADER_STRING = "Authorization";
    private final String TOKEN_PREFIX = "Bearer ";
    private final Key key;

    public JwtAuthenticationFilter(String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        // Bỏ qua xác thực cho endpoint forgot-password nếu không có token
        //if (path.equals("/api/users/forgot-password") && request.getHeader(HEADER_STRING) == null) {
            String method = request.getMethod();
            // System.out.println(
            // "Processing request: URI=" + path + ", Method=" + method + ", ContextPath=" +
            // request.getContextPath());
            // if ("OPTIONS".equalsIgnoreCase(method)) {
            // System.out.println("Skipping authentication for OPTIONS request: " + path);
            // chain.doFilter(request, response);
            // return;
            // }
            if (path.equals("/api/ai/full-analysis") ||
                    path.startsWith("/oauth2/authorization") ||
                    path.startsWith("/login/oauth2/code") ||
                    path.startsWith("/api/users/register") ||
                    path.startsWith("/api/users/login") ||
                    path.startsWith("/api/questions/")) {
                System.out.println("Skipping authentication for: " + path + " (Method: " + method + ")");
                chain.doFilter(request, response);
                return;
            }

            String header = request.getHeader(HEADER_STRING);
            if (header != null && header.startsWith(TOKEN_PREFIX)) {
                String token = header.replace(TOKEN_PREFIX, "");
                try {

                    Claims claims = Jwts.parser()
                            .setSigningKey(key)
                            .parseClaimsJws(token)
                            .getBody();
                    String username = claims.getSubject();
                    if (username != null) {
                        List<String> roles = ((List<?>) claims.get("roles")).stream()
                                .map(Object::toString)
                                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                                .collect(Collectors.toList());
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                roles == null ? Collections.emptyList()
                                        : roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                } catch (ExpiredJwtException | MalformedJwtException e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
                    return;
                }
            }
            chain.doFilter(request, response);
        }
    }
//}

// @Override
// protected void doFilterInternal(HttpServletRequest request,
// HttpServletResponse response, FilterChain chain)
// throws ServletException, IOException {
// String path = request.getRequestURI();
// String method = request.getMethod();
// System.out.println(
// "Processing request: URI=" + path + ", Method=" + method + ", ContextPath=" +
// request.getContextPath());
// if ("OPTIONS".equalsIgnoreCase(method)) {
// System.out.println("Skipping authentication for OPTIONS request: " + path);
// chain.doFilter(request, response);
// return;
// }
// if (path.equals("/api/ai/full-analysis") ||
// path.startsWith("/api/users/register") ||
// path.startsWith("/api/users/login") ||
// path.startsWith("/api/questions/")) {
// System.out.println("Skipping authentication for: " + path + " (Method: " +
// method + ")");
// chain.doFilter(request, response);
// return;
// }
//
// String header = request.getHeader(HEADER_STRING);
// System.out.println("Authorization header: " + header);
// if (header != null && header.startsWith(TOKEN_PREFIX)) {
// String token = header.replace(TOKEN_PREFIX, "");
// try {
// Claims claims = Jwts.parserBuilder()
// .setSigningKey(key)
// .build()
// .parseClaimsJws(token)
// .getBody();
// String username = claims.getSubject();
// if (username != null) {
// List<String> roles = ((List<?>) claims.get("roles")).stream()
// .map(Object::toString)
// .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
// .collect(Collectors.toList());
// UsernamePasswordAuthenticationToken auth = new
// UsernamePasswordAuthenticationToken(
// username, null,
// roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
// SecurityContextHolder.getContext().setAuthentication(auth);
// System.out.println("Authentication successful for user: " + username);
// }
// } catch (ExpiredJwtException | MalformedJwtException e) {
// System.err.println("Token error: " + e.getMessage());
// response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired
// JWT token");
// return;
// }
// } else {
// System.out.println("No valid token found, denying access for secured path: "
// + path);
// }
// chain.doFilter(request, response);
// }
// }
