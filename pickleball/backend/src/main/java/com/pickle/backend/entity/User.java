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
    @Column(name = "userId", nullable = false)
    private String userId;

    @NotBlank(message = "Name is mandatory")
    @Column(name = "name")
    private String name;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Column(name = "email", unique = true)
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Column(name = "password")
    private String password;

    @NotNull(message = "Role is mandatory")
    @Column(name = "role")
    private String role;

    @Column(name = "skill_level")
    private String skillLevel;

    @Column(name = "preferences")
    private String preferences;

    public String getRole() {
        return role;
    }
}