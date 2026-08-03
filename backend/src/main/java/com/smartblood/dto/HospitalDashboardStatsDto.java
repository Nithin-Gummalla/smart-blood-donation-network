package com.smartblood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDashboardStatsDto {

    private HospitalProfileDto profile;
    private long activeRequestsCount;
    private long approvedRequestsCount;
    private long totalBloodUnitsInStock;
    private List<InventoryResponseDto> inventoryList;
    private List<BloodRequestResponseDto> pendingRequests;
}
