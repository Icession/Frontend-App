package com.ridewatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Long totalUsers;
    private Long activeUsers;
    private Long totalTrips;
    private Double totalDistanceKm;
    private Double averageSafetyScore;
    private Long emergencyAlertsCount;
    private Long failedAlertsCount;
    private Long faqCount;
}
