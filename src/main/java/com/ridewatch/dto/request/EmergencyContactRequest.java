package com.ridewatch.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmergencyContactRequest {
    @NotBlank public String name;
    @Email @NotBlank public String email;
    public String phone;
    public String relationship;
}
