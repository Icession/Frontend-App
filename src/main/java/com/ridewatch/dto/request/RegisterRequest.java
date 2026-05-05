package com.ridewatch.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank public String name;
    @Email @NotBlank public String email;
    @NotBlank public String password;
    public String gender;
    public String contact;
}
