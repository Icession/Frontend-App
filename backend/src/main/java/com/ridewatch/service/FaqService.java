package com.ridewatch.service;

import com.ridewatch.dto.FaqDTO;
import com.ridewatch.dto.FaqRequest;
import com.ridewatch.model.Faq;
import com.ridewatch.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    public List<FaqDTO> getAllFaqs() {
        return faqRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FaqDTO getFaqById(Long id) {
        return faqRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
    }

    public FaqDTO createFaq(FaqRequest request) {
        Faq faq = Faq.builder()
                .category(request.getCategory())
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        Faq saved = faqRepository.save(faq);
        return convertToDTO(saved);
    }

    public FaqDTO updateFaq(Long id, FaqRequest request) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));

        faq.setCategory(request.getCategory());
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        if (request.getDisplayOrder() != null) {
            faq.setDisplayOrder(request.getDisplayOrder());
        }

        Faq updated = faqRepository.save(faq);
        return convertToDTO(updated);
    }

    public void deleteFaq(Long id) {
        faqRepository.deleteById(id);
    }

    public List<FaqDTO> getFaqsByCategory(String category) {
        return faqRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FaqDTO convertToDTO(Faq faq) {
        return FaqDTO.builder()
                .id(faq.getId())
                .category(faq.getCategory())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .displayOrder(faq.getDisplayOrder())
                .build();
    }
}
