package com.pickle.backend.dto;

// Đây là một lớp DTO (Data Transfer Object) để định nghĩa cấu trúc phản hồi khi đăng nhập thành công hoặc thất bại.
public class LoginResponse {
    private String token;
    private String message;
    private String role;
    private String id_user;

    // Constructor để khởi tạo đối tượng với token và message
    public LoginResponse(String token, String message,  String role, String id_user) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.id_user = id_user;
    }
    public String getId_user() {
        return id_user;
    }
    public void setId_user(String id_user) {
        this.id_user = id_user;
    }
    // Getter cho token. Cần thiết để Jackson có thể chuyển đổi thành JSON.
    public String getToken() {
        return token;
    }

    // Getter cho message. Cần thiết để Jackson có thể chuyển đổi thành JSON.
    public String getMessage() {
        return message;
    }

    public String getRole() { return  role;}

    public void setToken(String token) {
         this.token = token;
    }
    public void setMessage(String message) {
         this.message = message;
    }

    public void setRole(String role) {
        this.role = role;
    }
}