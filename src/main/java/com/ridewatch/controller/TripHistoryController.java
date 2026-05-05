package com.ridewatch.controller;

import com.ridewatch.dto.request.TripHistoryRequest;
import com.ridewatch.model.TripHistory;
import com.ridewatch.model.User;
import com.ridewatch.repository.TripHistoryRepository;
import com.ridewatch.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trips")
public class TripHistoryController {

    @Autowired
    private TripHistoryRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/trips - Get all trips for current user
    @GetMapping
    public ResponseEntity<List<TripHistory>> getTrips(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(tripRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    // GET /api/trips/{id} - Get a single trip
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        TripHistory trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }
        return ResponseEntity.ok(trip);
    }

    // POST /api/trips - Save a trip (called from ETA feature after route is calculated)
    @PostMapping
    public ResponseEntity<?> createTrip(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TripHistoryRequest request) {

        User user = getCurrentUser(userDetails);

        TripHistory trip = TripHistory.builder()
                .origin(request.getOrigin())
                .originLat(request.getOriginLat())
                .originLng(request.getOriginLng())
                .destination(request.getDestination())
                .destinationLat(request.getDestinationLat())
                .destinationLng(request.getDestinationLng())
                .distanceKm(request.getDistanceKm())
                .travelTimeMinutes(request.getTravelTimeMinutes())
                .eta(request.getEta())
                .user(user)
                .build();

        TripHistory saved = tripRepository.save(trip);

        // Update user's total rides and distance
        user.setTotalRides(user.getTotalRides() + 1);
        if (request.getDistanceKm() != null) {
            user.setDistanceTraveledKm(user.getDistanceTraveledKm() + request.getDistanceKm());
        }
        userRepository.save(user);

        return ResponseEntity.ok(saved);
    }

    // PUT /api/trips/{id} - Update a trip
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TripHistoryRequest request) {

        User user = getCurrentUser(userDetails);
        TripHistory trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        trip.setOrigin(request.getOrigin());
        trip.setOriginLat(request.getOriginLat());
        trip.setOriginLng(request.getOriginLng());
        trip.setDestination(request.getDestination());
        trip.setDestinationLat(request.getDestinationLat());
        trip.setDestinationLng(request.getDestinationLng());
        trip.setDistanceKm(request.getDistanceKm());
        trip.setTravelTimeMinutes(request.getTravelTimeMinutes());
        trip.setEta(request.getEta());

        return ResponseEntity.ok(tripRepository.save(trip));
    }

    // DELETE /api/trips/{id} - Delete a trip
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getCurrentUser(userDetails);
        TripHistory trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        tripRepository.delete(trip);
        return ResponseEntity.ok(Map.of("message", "Trip deleted"));
    }
}
