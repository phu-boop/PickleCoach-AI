package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coach {
    @Id
    @Column(name = "userId", nullable = false)
    private String userId;

    @NotNull(message = "User is mandatory")
    @OneToOne
    @MapsId
    @JoinColumn(name = "userId")
    private User user;

    @NotEmpty(message = "Certifications cannot be empty")
    @ElementCollection
    @Column(name = "certifications")
    private List<String> certifications;

    @NotEmpty(message = "Availability cannot be empty")
    @ElementCollection
    @Column(name = "availability")
    private List<LocalDateTime> availability;

    @NotEmpty(message = "Specialties cannot be empty")
    @ElementCollection
    @Column(name = "specialties")
    private List<String> specialties;
}