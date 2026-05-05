package com.ridewatch.dto.request;
import lombok.Data;

@Data
public class UpdateUserRequest {
    public String name;
    public String gender;
    public String contact;
    public String email;
}
