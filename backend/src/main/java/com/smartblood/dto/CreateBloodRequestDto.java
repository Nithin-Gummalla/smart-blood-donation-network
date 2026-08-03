package com.smartblood.dto;

import com.smartblood.model.EmergencyLevel;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBloodRequestDto {

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Units required is mandatory")
    @Min(value = 1, message = "At least 1 unit must be requested")
    private Integer unitsRequired;

    @NotNull(message = "Emergency level is required")
    private EmergencyLevel emergencyLevel;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotNull(message = "Required date is mandatory")
    @FutureOrPresent(message = "Required date cannot be in the past")
    private LocalDate requiredDate;

    private Long hospitalId;
}
