package com.smartblood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorDashboardStatsDto {

    private DonorProfileDto profile;
    private int profileCompletionPercentage;
    private int totalDonationsCount;
    private Boolean isEligibleToDonate;
    private LocalDate nextEligibleDate;
    private List<BloodRequestResponseDto> nearbyUrgentRequests;
}
