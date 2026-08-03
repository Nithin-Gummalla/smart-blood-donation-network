package com.smartblood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponseDto {

    private Long id;
    private Long hospitalId;
    private String hospitalName;
    private String bloodGroup;
    private Integer unitsAvailable;
    private LocalDate expiryDate;
    private String status;
    private Boolean isLowStock;
}
