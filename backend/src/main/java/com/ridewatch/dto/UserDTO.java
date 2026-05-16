package com.ridewatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String gender;
    private String contact;
    private Integer totalRides;
    private Double distanceTraveledKm;
    private Double safetyScore;
    private Boolean verified;
    private Boolean isActive;
    private String memberSince;
}
