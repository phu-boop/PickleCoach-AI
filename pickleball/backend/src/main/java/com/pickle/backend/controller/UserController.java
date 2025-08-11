package com.pickle.backend.controller;

import com.pickle.backend.entity.User;
import com.pickle.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.pickle.backend.dto.UserRegistrationRequest;
import com.pickle.backend.service.JwtService;
import com.pickle.backend.dto.OTPRequestDTO;
import com.pickle.backend.dto.ResetPasswordDTO;
import java.util.List;
import com.pickle.backend.dto.LoginResponse;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.HashMap;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User savedUser = userService.createUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<User> updateUser(@PathVariable String id, @Valid @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.registerUser(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword()
            );
            return ResponseEntity.ok("User registered successfully with ID: " + user.getUserId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> login(@RequestBody UserRegistrationRequest request) {
        if (userService.checkAccount(request.getEmail(), request.getPassword())) {
            String role = userService.getRolebyEmail(request.getEmail());
            String token = jwtService.generateToken(request.getEmail(), List.of(role));
            String id_user = userService.getIdbyEmail(request.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, "login successful", role, id_user));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null, "Invalid email or password", null, null));
        }
    }

    @PostMapping("/forgot-password")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        ResponseEntity<String> response = userService.initiatePasswordReset(email);
        return ResponseEntity.status(response.getStatusCode())
                .body(Map.of("message", response.getBody()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody OTPRequestDTO otpRequest) {
        ResponseEntity<String> response = userService.verifyOtp(otpRequest.getOtp());
        return ResponseEntity.status(response.getStatusCode())
                .body(Map.of("message", response.getBody()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        ResponseEntity<String> response = userService.resetPassword(resetPasswordDTO.getPassword());
        return ResponseEntity.status(response.getStatusCode())
                .body(Map.of("message", response.getBody()));
    }
    @PostMapping("update-avata")
    public ResponseEntity<String> avata(@RequestBody Map<String, String> request) {
        String url = request.get("avata");
        String id = request.get("id");
        String response =userService.updateAvata(url,id);
        return ResponseEntity.ok(response);
    }

    // Thêm endpoint mới để lấy thống kê vai trò người dùng
    @PreAuthorize("hasRole('admin')")
    @GetMapping("/stats/roles")
    public ResponseEntity<Map<String, Object>> getUserRoleStats() {
        List<Object[]> roleCounts = userService.getUserRoleCounts();
        Long totalUsers = userService.getTotalUsers();

        Map<String, Object> stats = new HashMap<>();
        roleCounts.forEach(row -> stats.put((String) row[0], row[1]));
        stats.put("total", totalUsers);

        return ResponseEntity.ok(stats);
    }
}