package com.smartblood.controller;

import com.smartblood.dto.ApiResponse;
import com.smartblood.dto.InventoryResponseDto;
import com.smartblood.dto.InventoryUpdateDto;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.service.BloodInventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Blood Inventory Management", description = "Endpoints for checking stock, updating inventory, and low stock warnings")
public class BloodInventoryController {

    private final BloodInventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get blood stock inventory")
    public ResponseEntity<ApiResponse<List<InventoryResponseDto>>> getInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<InventoryResponseDto> inventory = (userDetails != null)
                ? inventoryService.getInventoryByHospitalUser(userDetails.getId())
                : inventoryService.getAllInventory();
        return ResponseEntity.ok(ApiResponse.success("Inventory items retrieved", inventory));
    }

    @GetMapping("/public/summary")
    @Operation(summary = "Get global blood stock count grouped by blood group")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getGlobalSummary() {
        return ResponseEntity.ok(ApiResponse.success("Global blood stock summary", inventoryService.getGlobalInventorySummary()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_HOSPITAL') or hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Add or update blood inventory stock level")
    public ResponseEntity<ApiResponse<InventoryResponseDto>> updateInventory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody InventoryUpdateDto dto) {
        InventoryResponseDto updated = inventoryService.updateInventory(dto, userDetails);
        return ResponseEntity.ok(ApiResponse.success("Inventory updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete an inventory record (e.g., expired stock)")
    public ResponseEntity<ApiResponse<String>> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.ok(ApiResponse.success("Inventory record deleted"));
    }
}
