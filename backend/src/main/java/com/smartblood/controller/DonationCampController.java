package com.smartblood.controller;

import com.smartblood.dto.ApiResponse;
import com.smartblood.dto.DonationCampDto;
import com.smartblood.service.DonationCampService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/camps")
@RequiredArgsConstructor
@Tag(name = "Donation Camps", description = "Endpoints for donation camp scheduling and discovery")
public class DonationCampController {

    private final DonationCampService campService;

    @GetMapping
    @Operation(summary = "Get upcoming blood donation camps")
    public ResponseEntity<ApiResponse<List<DonationCampDto>>> getUpcomingCamps() {
        return ResponseEntity.ok(ApiResponse.success("Upcoming camps retrieved", campService.getUpcomingCamps()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_HOSPITAL')")
    @Operation(summary = "Schedule a new donation camp")
    public ResponseEntity<ApiResponse<DonationCampDto>> createCamp(@RequestBody DonationCampDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Donation camp created successfully", campService.createCamp(dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Cancel or delete a donation camp")
    public ResponseEntity<ApiResponse<String>> deleteCamp(@PathVariable Long id) {
        campService.deleteCamp(id);
        return ResponseEntity.ok(ApiResponse.success("Camp deleted successfully"));
    }
}
