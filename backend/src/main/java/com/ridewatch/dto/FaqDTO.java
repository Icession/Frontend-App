package com.ridewatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqDTO {
    private Long id;
    private String category;
    private String question;
    private String answer;
    private Integer displayOrder;
}
