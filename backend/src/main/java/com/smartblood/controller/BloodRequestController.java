package com.smartblood.controller;

import com.smartblood.dto.ApiResponse;
import com.smartblood.dto.BloodRequestResponseDto;
import com.smartblood.dto.CreateBloodRequestDto;
import com.smartblood.dto.UpdateRequestStatusDto;
import com.smartblood.model.RequestStatus;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.service.BloodRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blood-requests")
@RequiredArgsConstructor
@Tag(name = "Blood Request Management", description = "Endpoints to create, view, approve, fulfill, and cancel blood requests")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new blood request (Supports emergency tag)")
    public ResponseEntity<ApiResponse<BloodRequestResponseDto>> createRequest(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateBloodRequestDto dto) {
        BloodRequestResponseDto response = bloodRequestService.createRequest(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Blood request submitted successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all blood requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponseDto>>> getAllRequests(
            @RequestParam(required = false) RequestStatus status) {
        List<BloodRequestResponseDto> requests = (status != null)
                ? bloodRequestService.getRequestsByStatus(status)
                : bloodRequestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.success("Blood requests retrieved", requests));
    }

    @GetMapping("/public/active")
    @Operation(summary = "Get public active & emergency blood requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponseDto>>> getPublicActiveRequests() {
        List<BloodRequestResponseDto> requests = bloodRequestService.getRequestsByStatus(RequestStatus.PENDING);
        return ResponseEntity.ok(ApiResponse.success("Active blood requests", requests));
    }

    @GetMapping("/my-requests")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get blood requests submitted by the current user")
    public ResponseEntity<ApiResponse<List<BloodRequestResponseDto>>> getMyRequests(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<BloodRequestResponseDto> requests = bloodRequestService.getRequestsByRequester(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("User requests retrieved", requests));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get blood request details by ID")
    public ResponseEntity<ApiResponse<BloodRequestResponseDto>> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Request details fetched", bloodRequestService.getRequestById(id)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_HOSPITAL') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update blood request status (Approve, Fulfill, Reject)")
    public ResponseEntity<ApiResponse<BloodRequestResponseDto>> updateStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateRequestStatusDto dto) {
        BloodRequestResponseDto updated = bloodRequestService.updateRequestStatus(id, dto, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Request status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel a blood request")
    public ResponseEntity<ApiResponse<String>> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        bloodRequestService.cancelRequest(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Blood request cancelled successfully"));
    }
}
