package com.smartblood.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InventoryUpdateDto {

    private Long hospitalId;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Units count is required")
    @Min(value = 0, message = "Units available cannot be negative")
    private Integer unitsAvailable;

    private LocalDate expiryDate;
    private String status;
}
