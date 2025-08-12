package com.pickle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coach {
    @Id
    @Column(name = "userId", nullable = false, length = 36)
    private String userId;

    @NotNull(message = "User is mandatory")
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    @ElementCollection
    @CollectionTable(name = "coach_certifications", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "certification")
    private List<String> certifications;

    @ElementCollection
    @CollectionTable(name = "coach_availability", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "availability")
    private List<String> availability;

    @ElementCollection
    @CollectionTable(name = "coach_specialties", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "specialty")
    private List<String> specialties;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private Level level;

    public enum Level {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED
    }

}