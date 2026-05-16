package com.ridewatch.repository;

import com.ridewatch.model.EmergencyAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
    List<EmergencyAlert> findByUserId(Long userId);

    @Query("SELECT a FROM EmergencyAlert a WHERE a.sentAt >= ?1 AND a.sentAt <= ?2")
    List<EmergencyAlert> findAlertsInDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(a) FROM EmergencyAlert a WHERE a.status = 'FAILED'")
    long countFailedAlerts();
}
