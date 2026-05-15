package com.ridewatch.controller;

import com.ridewatch.dto.FaqDTO;
import com.ridewatch.dto.FaqRequest;
import com.ridewatch.service.FaqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/faqs")
// @CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class FaqAdminController {

    private final FaqService faqService;

    @GetMapping
    public ResponseEntity<List<FaqDTO>> getAllFaqs() {
        return ResponseEntity.ok(faqService.getAllFaqs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaqDTO> getFaqById(@PathVariable Long id) {
        return ResponseEntity.ok(faqService.getFaqById(id));
    }

    @PostMapping
    public ResponseEntity<FaqDTO> createFaq(@Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.createFaq(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaqDTO> updateFaq(
            @PathVariable Long id,
            @Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.updateFaq(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaq(@PathVariable Long id) {
        faqService.deleteFaq(id);
        return ResponseEntity.ok().body("FAQ deleted successfully");
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FaqDTO>> getFaqsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(faqService.getFaqsByCategory(category));
    }
}
