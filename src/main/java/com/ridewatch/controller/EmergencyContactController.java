package com.ridewatch.controller;

import com.ridewatch.dto.request.EmergencyContactRequest;
import com.ridewatch.model.EmergencyContact;
import com.ridewatch.model.User;
import com.ridewatch.repository.EmergencyContactRepository;
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
@RequestMapping("/api/emergency-contacts")
public class EmergencyContactController {

    @Autowired
    private EmergencyContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET /api/emergency-contacts - List all contacts for current user
    @GetMapping
    public ResponseEntity<List<EmergencyContact>> getContacts(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(contactRepository.findByUserId(user.getId()));
    }

    // POST /api/emergency-contacts - Add a new contact (max 3)
    @PostMapping
    public ResponseEntity<?> addContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EmergencyContactRequest request) {

        User user = getCurrentUser(userDetails);

        if (contactRepository.countByUserId(user.getId()) >= 3) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Maximum of 3 emergency contacts allowed"));
        }

        EmergencyContact contact = EmergencyContact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .relationship(request.getRelationship())
                .user(user)
                .build();

        return ResponseEntity.ok(contactRepository.save(contact));
    }

    // PUT /api/emergency-contacts/{id} - Update a contact
    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EmergencyContactRequest request) {

        User user = getCurrentUser(userDetails);
        EmergencyContact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setRelationship(request.getRelationship());

        return ResponseEntity.ok(contactRepository.save(contact));
    }

    // DELETE /api/emergency-contacts/{id} - Delete a contact
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = getCurrentUser(userDetails);
        EmergencyContact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        contactRepository.delete(contact);
        return ResponseEntity.ok(Map.of("message", "Contact deleted"));
    }
}
