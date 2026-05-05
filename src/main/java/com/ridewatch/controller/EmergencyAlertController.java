package com.ridewatch.controller;

import com.ridewatch.dto.request.EmergencyAlertRequest;
import com.ridewatch.model.EmergencyAlert;
import com.ridewatch.model.User;
import com.ridewatch.repository.EmergencyAlertRepository;
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
@RequestMapping("/api/emergency-alerts")
public class EmergencyAlertController {

    @Autowired
    private EmergencyAlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/emergency-alerts - Get alert history for current user
    @GetMapping
    public ResponseEntity<List<EmergencyAlert>> getAlerts(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(alertRepository.findByUserIdOrderBySentAtDesc(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createAlert(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EmergencyAlertRequest request) {

        User user = getCurrentUser(userDetails);

        EmergencyAlert alert = EmergencyAlert.builder()
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .mapsLink(request.getMapsLink())
                .status(EmergencyAlert.AlertStatus.SENT)
                .user(user)
                .build();

        return ResponseEntity.ok(alertRepository.save(alert));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getCurrentUser(userDetails);
        EmergencyAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        alertRepository.delete(alert);
        return ResponseEntity.ok(Map.of("message", "Alert record deleted"));
    }
}
