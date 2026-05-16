package com.ridewatch.service;

import com.ridewatch.dto.DashboardStatsDTO;
import com.ridewatch.dto.UserDTO;
import com.ridewatch.repository.EmergencyAlertRepository;
import com.ridewatch.repository.FaqRepository;
import com.ridewatch.repository.TripHistoryRepository;
import com.ridewatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TripHistoryRepository tripHistoryRepository;
    private final EmergencyAlertRepository emergencyAlertRepository;
    private final FaqRepository faqRepository;

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(user -> user.getIsActive())
                .count();

        long totalTrips = tripHistoryRepository.count();
        
        double totalDistanceKm = tripHistoryRepository.findAll().stream()
                .mapToDouble(trip -> trip.getDistanceKm() != null ? trip.getDistanceKm() : 0)
                .sum();

        double averageSafetyScore = userRepository.findAll().stream()
                .mapToDouble(user -> user.getSafetyScore() != null ? user.getSafetyScore() : 100)
                .average()
                .orElse(100.0);

        long emergencyAlertsCount = emergencyAlertRepository.count();
        long failedAlertsCount = emergencyAlertRepository.countFailedAlerts();
        long faqCount = faqRepository.count();

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalTrips(totalTrips)
                .totalDistanceKm(totalDistanceKm)
                .averageSafetyScore(Math.round(averageSafetyScore * 100.0) / 100.0)
                .emergencyAlertsCount(emergencyAlertsCount)
                .failedAlertsCount(failedAlertsCount)
                .faqCount(faqCount)
                .build();
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateUserStatus(Long userId, Boolean isActive) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    public UserDTO createUser(com.ridewatch.dto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        com.ridewatch.model.User user = com.ridewatch.model.User.builder()
                .name(request.getFirstName() + " " + request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(com.ridewatch.model.User.UserRole.USER)
                .isActive(true)
                .verified(false)
                .build();
        com.ridewatch.model.User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public void deleteUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private UserDTO convertToDTO(com.ridewatch.model.User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .gender(user.getGender())
                .contact(user.getContact())
                .totalRides(user.getTotalRides())
                .distanceTraveledKm(user.getDistanceTraveledKm())
                .safetyScore(user.getSafetyScore())
                .verified(user.getVerified())
                .isActive(user.getIsActive())
                .memberSince(user.getMemberSince() != null ? user.getMemberSince().toString() : null)
                .build();
    }
}
