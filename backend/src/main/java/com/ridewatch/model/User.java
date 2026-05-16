package com.ridewatch.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    private String gender;
    private String contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Builder.Default
    @Column(name = "total_rides")
    private Integer totalRides = 0;

    @Builder.Default
    @Column(name = "distance_traveled_km")
    private Double distanceTraveledKm = 0.0;

    @Builder.Default
    @Column(name = "safety_score")
    private Double safetyScore = 100.0;

    @Column(name = "member_since", updatable = false)
    private LocalDateTime memberSince;

    @Builder.Default
    @Column(name = "verified")
    private Boolean verified = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripHistory> tripHistories = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmergencyAlert> emergencyAlerts = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        memberSince = LocalDateTime.now();
        if (role == null) {
            role = UserRole.USER;
        }
    }

    public enum UserRole {
        ADMIN, USER
    }
}
