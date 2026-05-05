package com.ridewatch.controller;

import com.ridewatch.dto.request.FaqRequest;
import com.ridewatch.model.Faq;
import com.ridewatch.repository.FaqRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/faqs")
public class FaqController {

    @Autowired
    private FaqRepository faqRepository;

    // GET /api/faqs - Get all FAQs (public)
    @GetMapping
    public ResponseEntity<List<Faq>> getAllFaqs(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(faqRepository.findByCategoryOrderByDisplayOrderAsc(category));
        }
        return ResponseEntity.ok(faqRepository.findAllByOrderByCategoryAscDisplayOrderAsc());
    }

    // GET /api/faqs/{id} - Get a single FAQ
    @GetMapping("/{id}")
    public ResponseEntity<?> getFaq(@PathVariable Long id) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        return ResponseEntity.ok(faq);
    }

    // POST /api/faqs - Create a FAQ (protected)
    @PostMapping
    public ResponseEntity<?> createFaq(@Valid @RequestBody FaqRequest request) {
        Faq faq = Faq.builder()
                .category(request.getCategory())
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();
        return ResponseEntity.ok(faqRepository.save(faq));
    }

    // PUT /api/faqs/{id} - Update a FAQ (protected)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaq(
            @PathVariable Long id,
            @Valid @RequestBody FaqRequest request) {

        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));

        faq.setCategory(request.getCategory());
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        if (request.getDisplayOrder() != null) faq.setDisplayOrder(request.getDisplayOrder());

        return ResponseEntity.ok(faqRepository.save(faq));
    }

    // DELETE /api/faqs/{id} - Delete a FAQ (protected)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaq(@PathVariable Long id) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        faqRepository.delete(faq);
        return ResponseEntity.ok(Map.of("message", "FAQ deleted"));
    }
}
