package com.smartblood.controller;

import com.smartblood.dto.ApiResponse;
import com.smartblood.dto.DonationHistoryDto;
import com.smartblood.dto.DonorProfileDto;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.service.DonorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/donors")
@RequiredArgsConstructor
@Tag(name = "Donor Management", description = "Endpoints for searching donors, updating donor profiles, and viewing donation history")
public class DonorController {

    private final DonorService donorService;

    @GetMapping("/search")
    @Operation(summary = "Search eligible blood donors by Blood Group, City, State, or Availability")
    public ResponseEntity<ApiResponse<List<DonorProfileDto>>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Boolean isAvailable) {
        List<DonorProfileDto> donors = donorService.searchDonors(bloodGroup, city, state, isAvailable);
        return ResponseEntity.ok(ApiResponse.success("Donors fetched successfully", donors));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_DONOR') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get current donor profile")
    public ResponseEntity<ApiResponse<DonorProfileDto>> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        DonorProfileDto profile = donorService.getDonorProfileByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Donor profile fetched", profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_DONOR') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update current donor profile")
    public ResponseEntity<ApiResponse<DonorProfileDto>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody DonorProfileDto dto) {
        DonorProfileDto updated = donorService.updateDonorProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAuthority('ROLE_DONOR') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get donor donation history")
    public ResponseEntity<ApiResponse<List<DonationHistoryDto>>> getHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<DonationHistoryDto> history = donorService.getDonationHistory(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Donation history retrieved", history));
    }

    @PostMapping("/history")
    @PreAuthorize("hasAuthority('ROLE_DONOR') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Add a new donation record")
    public ResponseEntity<ApiResponse<DonationHistoryDto>> addDonation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String hospitalOrCamp,
            @RequestParam(required = false, defaultValue = "1") Integer units) {
        DonationHistoryDto record = donorService.addDonationRecord(userDetails.getId(), hospitalOrCamp, units);
        return ResponseEntity.ok(ApiResponse.success("Donation record logged successfully", record));
    }
}
