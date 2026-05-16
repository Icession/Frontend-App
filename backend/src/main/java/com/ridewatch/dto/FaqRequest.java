package com.ridewatch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaqRequest {
    @NotBlank
    private String category;

    @NotBlank
    private String question;

    @NotBlank
    private String answer;

    private Integer displayOrder;
}
