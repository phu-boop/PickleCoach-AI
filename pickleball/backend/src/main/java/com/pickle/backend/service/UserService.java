package com.pickle.backend.service;

import com.pickle.backend.entity.User;
import com.pickle.backend.exception.ResourceNotFoundException;
import com.pickle.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Biến tĩnh để lưu email tạm thời trong quá trình quên mật khẩu
    private String tempEmailForReset;

    private String storedOtp;

    // Thời gian gửi OTP cuối cùng
    private LocalDateTime lastOtpSentTime;

    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String userId) {
        logger.info("Fetching user with id: {}", userId);
        return userRepository.findById(userId);
    }

    public User createUser(User user) {
        logger.info("Creating user with email: {}", user.getEmail());
        user.setUserId(UUID.randomUUID().toString());
        return userRepository.save(user);
    }

    public User updateUser(String userId, User userDetails) {
        logger.info("Updating user with id: {}", userId);
        return userRepository.findById(userId).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setRole(userDetails.getRole());
            return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    public String getRolebyEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        return "ROLE_" + user.getRole();
    }

    public String getIdbyEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        return user.getId();
    }

    public void deleteUser(String userId) {
        logger.info("Deleting user with id: {}", userId);
        if (!userRepository.existsById(userId)) {
            logger.warn("User with id {} not found", userId);
            throw new ResourceNotFoundException("User not found with id " + userId);
        }
        userRepository.deleteById(userId);
    }

    public Optional<User> findByEmail(String email) {
        logger.info("Fetching user with email: {}", email);
        return userRepository.findByEmail(email);
    }

    public User registerUser(String name, String email, String rawPassword) {
        String hashedPassword = passwordEncoder.encode(rawPassword);
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setName(name);
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setRole("USER");
        return userRepository.save(user);
    }

    public boolean checkAccount(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email).orElse(null);
            return (user != null && passwordEncoder.matches(password, user.getPassword()));
        }
        return false;
    }

    @Autowired
    private EmailService emailService;

    public ResponseEntity<String> initiatePasswordReset(String email) {
        // Kiểm tra định dạng email phải là xxx@gmail.com
        String emailRegex = "^[A-Za-z0-9+_.-]+@gmail\\.com$";
        if (!Pattern.matches(emailRegex, email)) {
            return ResponseEntity.badRequest().body("Vui lòng nhập đúng định dạng xxx@gmail.com");
        }

        // Kiểm tra sự tồn tại của email trong database
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || "ADMIN".equalsIgnoreCase(user.getRole()) || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Không có tài khoản nào khớp với email bạn nhập");
        }

        // Kiểm tra thời gian chờ 15 giây
        if (lastOtpSentTime != null) {
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(lastOtpSentTime.plusSeconds(15))) {
                long secondsLeft = 15 - java.time.Duration.between(lastOtpSentTime, now).getSeconds();
                return ResponseEntity.badRequest().body("Vui lòng đợi " + secondsLeft + " giây trước khi gửi lại OTP.");
            }
        }

        String otp = generateOtp();
        storedOtp = otp;
        tempEmailForReset = email; // Lưu email tạm thời
        lastOtpSentTime = LocalDateTime.now(); // Cập nhật thời gian gửi OTP
        logger.info("Sending OTP to email: {}", email);
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn.");
    }

    public ResponseEntity<String> verifyOtp(String otp) {
        logger.info("Verifying OTP: {}", otp);
        if (otp != null && otp.equals(storedOtp)) {
            return ResponseEntity.ok("Mã OTP hợp lệ.");
        }
        return ResponseEntity.badRequest().body("Mã OTP không đúng.");
    }

    public ResponseEntity<String> resetPassword(String newPassword) {
        if (tempEmailForReset == null) {
            logger.warn("No email found for password reset");
            return ResponseEntity.badRequest().body("Không thể xác định email. Vui lòng thử lại.");
        }

        User user = userRepository.findByEmail(tempEmailForReset).orElse(null);
        if (user != null && user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            storedOtp = null;
            tempEmailForReset = null;
            lastOtpSentTime = null; // Xóa thời gian khi hoàn tất
            logger.info("Password reset successful for email: {}", tempEmailForReset);
            return ResponseEntity.ok("Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.");
        }
        logger.warn("Password reset failed for email: {}", tempEmailForReset);
        return ResponseEntity.badRequest().body("Lỗi khi cập nhật mật khẩu.");
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    public String updateAvata(String url, String id) {
        try {
            // Sử dụng findById để lấy Optional<User>
            Optional<User> optionalUser = userRepository.findById(id);
            if (!optionalUser.isPresent()) {
                return "Không tìm thấy người dùng với id: " + id;
            }

            // Lấy đối tượng User từ Optional
            User user = optionalUser.get();
            user.setUrlavata(url); // Cập nhật URL avatar
            userRepository.save(user); // Lưu thay đổi vào cơ sở dữ liệu
            return "Cập nhật avatar thành công";
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }

    // Thêm phương thức để lấy số lượng người dùng theo vai trò
    public List<Object[]> getUserRoleCounts() {
        logger.info("Fetching user role counts");
        return userRepository.countUsersByRole();
    }

    // Thêm phương thức để lấy tổng số người dùng
    public Long getTotalUsers() {
        logger.info("Fetching total number of users");
        return userRepository.countTotalUsers();
    }
}