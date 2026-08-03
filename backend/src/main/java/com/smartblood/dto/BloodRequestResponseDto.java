package com.smartblood.dto;

import com.smartblood.model.EmergencyLevel;
import com.smartblood.model.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequestResponseDto {

    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private String requesterPhone;
    private Long hospitalId;
    private String patientName;
    private String bloodGroup;
    private Integer unitsRequired;
    private Integer unitsFulfilled;
    private RequestStatus status;
    private EmergencyLevel emergencyLevel;
    private String city;
    private String state;
    private String hospitalName;
    private LocalDate requiredDate;
    private LocalDateTime createdAt;
}
