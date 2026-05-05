package com.ridewatch.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TripHistoryRequest {
    @NotBlank public String origin;
    public Double originLat;
    public Double originLng;
    @NotBlank public String destination;
    public Double destinationLat;
    public Double destinationLng;
    public Double distanceKm;
    public Integer travelTimeMinutes;
    public String eta;
}
