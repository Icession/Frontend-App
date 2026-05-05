package com.ridewatch.controller;

import com.ridewatch.dto.request.UpdateUserRequest;
import com.ridewatch.model.User;
import com.ridewatch.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET /api/users/me - Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // PUT /api/users/me - Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserRequest request) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getContact() != null) user.setContact(request.getContact());
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
            }
            user.setEmail(request.getEmail());
        }

        return ResponseEntity.ok(userRepository.save(user));
    }

    // DELETE /api/users/me - Delete account
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    // GET /api/users/{id} - Get user by ID (admin or same user)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        return ResponseEntity.ok(currentUser);
    }
}
