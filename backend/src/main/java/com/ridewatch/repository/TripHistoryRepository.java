package com.ridewatch.repository;

import com.ridewatch.model.TripHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripHistoryRepository extends JpaRepository<TripHistory, Long> {
    List<TripHistory> findByUserId(Long userId);

    @Query("SELECT SUM(t.distanceKm) FROM TripHistory t WHERE t.user.id = ?1")
    Double getTotalDistanceByUserId(Long userId);

    @Query("SELECT COUNT(t) FROM TripHistory t WHERE t.startTime >= ?1 AND t.startTime <= ?2")
    long countTripsInDateRange(LocalDateTime startDate, LocalDateTime endDate);
}
