package com.ridewatch.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_histories")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origin;

    @Column(name = "origin_lat")
    private Double originLat;

    @Column(name = "origin_lng")
    private Double originLng;

    @Column(nullable = false)
    private String destination;

    @Column(name = "destination_lat")
    private Double destinationLat;

    @Column(name = "destination_lng")
    private Double destinationLng;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "travel_time_minutes")
    private Integer travelTimeMinutes;

    @Column(name = "eta")
    private String eta;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}