package com.pickle.backend.dto;

// Đây là một lớp DTO (Data Transfer Object) để định nghĩa cấu trúc phản hồi khi đăng nhập thành công hoặc thất bại.
public class LoginResponse {
    private String token;
    private String message;

    // Constructor để khởi tạo đối tượng với token và message
    public LoginResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Getter cho token. Cần thiết để Jackson có thể chuyển đổi thành JSON.
    public String getToken() {
        return token;
    }

    // Getter cho message. Cần thiết để Jackson có thể chuyển đổi thành JSON.
    public String getMessage() {
        return message;
    }

    public void setToken(String token) {
         this.token = token;
    }
    public void setMessage(String message) {
         this.message = message;
    }
}