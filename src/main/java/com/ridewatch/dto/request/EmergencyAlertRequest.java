package com.ridewatch.dto.request;

import lombok.Data;

@Data
public class EmergencyAlertRequest {
    private Double latitude;
    private Double longitude;
    private String mapsLink;
}