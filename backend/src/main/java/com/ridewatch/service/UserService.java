package com.ridewatch.service;

import com.ridewatch.dto.AuthResponse;
import com.ridewatch.dto.LoginRequest;
import com.ridewatch.dto.RegisterRequest;
import com.ridewatch.dto.UserDTO;
import com.ridewatch.model.User;
import com.ridewatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getFirstName() + " " + request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())  // TODO: Hash password with BCrypt in production
                .role(User.UserRole.USER)
                .isActive(true)
                .verified(false)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .token("jwt-token-placeholder-" + savedUser.getId())  // TODO: Generate real JWT
                .user(mapToUserDTO(savedUser))
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOptional.get();

        // Check password (TODO: Use BCrypt for comparison in production)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("User account is inactive");
        }

        return AuthResponse.builder()
                .token("jwt-token-placeholder-" + user.getId())  // TODO: Generate real JWT
                .user(mapToUserDTO(user))
                .message("Login successful")
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
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
