package com.smartblood.controller;

import com.smartblood.dto.*;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard Statistics", description = "Role-based metrics and analytics dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get overall system stats for Admin Dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Admin stats fetched", dashboardService.getAdminStats()));
    }

    @GetMapping("/donor")
    @PreAuthorize("hasAuthority('ROLE_DONOR')")
    @Operation(summary = "Get personalized stats and eligibility for Donor Dashboard")
    public ResponseEntity<ApiResponse<DonorDashboardStatsDto>> getDonorDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Donor dashboard metrics fetched", dashboardService.getDonorDashboard(userDetails.getId())));
    }

    @GetMapping("/hospital")
    @PreAuthorize("hasAuthority('ROLE_HOSPITAL')")
    @Operation(summary = "Get hospital stats and active request queues for Hospital Dashboard")
    public ResponseEntity<ApiResponse<HospitalDashboardStatsDto>> getHospitalDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Hospital dashboard metrics fetched", dashboardService.getHospitalDashboard(userDetails.getId())));
    }
}
