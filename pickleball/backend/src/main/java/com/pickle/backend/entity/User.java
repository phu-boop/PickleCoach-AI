package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name = "userId", nullable = false, length = 36)
    private String userId;

    @NotBlank(message = "Name is mandatory")
    @Column(name = "name", length = 255)
    private String name;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Column(name = "email", unique = true, length = 255)
    private String email;

    @Column(name = "password", length = 255) // Bỏ @NotBlank, cho phép null hoặc rỗng
    private String password;

    @NotNull(message = "Role is mandatory")
    @Column(name = "role", length = 255)
    private String role;

    // Khôi phục các trường liên quan
    @Column(name = "skill_level", length = 255)
    private String skillLevel;

    @Column(name = "preferences", length = 255)
    private String preferences;

    // Getter tùy chỉnh cho role (nếu cần)
    // public String getRole() {
    //     return role;
    // }
    public String getId(){
        return userId;
    }

    // Xóa các phương thức tùy chỉnh gây lỗi
    // public void setPreferences(String string) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'setPreferences'");
    // }

    // public void setSkillLevel(String string) {
    //     // TODO Auto-generated method stub
    //     throw new UnsupportedOperationException("Unimplemented method 'setSkillLevel'");
    // }
}