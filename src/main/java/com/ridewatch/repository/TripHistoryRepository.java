package com.ridewatch.repository;

import com.ridewatch.model.TripHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripHistoryRepository extends JpaRepository<TripHistory, Long> {
    List<TripHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
