package com.smartblood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {

    private long totalDonors;
    private long activeDonors;
    private long totalHospitals;
    private long totalBloodRequests;
    private long fulfilledRequests;
    private long pendingRequests;
    private long totalInventoryUnits;
    private Map<String, Integer> inventoryByBloodGroup;
    private long lowStockAlertsCount;
}
