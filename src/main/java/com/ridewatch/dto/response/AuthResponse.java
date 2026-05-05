package com.ridewatch.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private Long id;
    private String name;
    private String email;

    public AuthResponse(String token, Long id, String name, String email) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
