package com.smartblood.controller;

import com.smartblood.dto.ApiResponse;
import com.smartblood.dto.HospitalProfileDto;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.service.HospitalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hospitals")
@RequiredArgsConstructor
@Tag(name = "Hospital Management", description = "Endpoints for hospital profiles and hospital directory")
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    @Operation(summary = "Get list of all registered hospitals")
    public ResponseEntity<ApiResponse<List<HospitalProfileDto>>> getAllHospitals() {
        return ResponseEntity.ok(ApiResponse.success("Hospitals fetched successfully", hospitalService.getAllHospitals()));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_HOSPITAL') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get hospital profile for current logged-in hospital user")
    public ResponseEntity<ApiResponse<HospitalProfileDto>> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        HospitalProfileDto profile = hospitalService.getHospitalByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Hospital profile fetched", profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_HOSPITAL') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update hospital profile")
    public ResponseEntity<ApiResponse<HospitalProfileDto>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody HospitalProfileDto dto) {
        HospitalProfileDto updated = hospitalService.updateHospitalProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Hospital profile updated", updated));
    }
}
