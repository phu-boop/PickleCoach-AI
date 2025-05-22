package com.pickle.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Calendar;

@Entity
@Table(name = "coaches")
@Getter
@Setter
@NoArgsConstructor
public class Coach {
    @Id
    @Column(name = "userId", nullable = false)
    private String userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "userId")
    private User user;

    @Column(name = "certifications")
    private String certifications;

    @Column(name = "availability")
    private Calendar availability;

    @ElementCollection
    @Column(name = "specialties")
    private java.util.List<String> specialties;
}