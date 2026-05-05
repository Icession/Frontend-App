package com.ridewatch.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FaqRequest {
    @NotBlank public String category;
    @NotBlank public String question;
    @NotBlank public String answer;
    public Integer displayOrder;
}
