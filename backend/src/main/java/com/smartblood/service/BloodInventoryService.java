package com.smartblood.service;

import com.smartblood.dto.InventoryResponseDto;
import com.smartblood.dto.InventoryUpdateDto;
import com.smartblood.entity.BloodInventory;
import com.smartblood.entity.Hospital;
import com.smartblood.exception.ResourceNotFoundException;
import com.smartblood.repository.BloodInventoryRepository;
import com.smartblood.repository.HospitalRepository;
import com.smartblood.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodInventoryService {

    private final BloodInventoryRepository inventoryRepository;
    private final HospitalRepository hospitalRepository;
    private static final int LOW_STOCK_THRESHOLD = 5;

    public List<InventoryResponseDto> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<InventoryResponseDto> getInventoryByHospitalUser(Long userId) {
        Hospital hospital = hospitalRepository.findByUserId(userId).orElse(null);
        if (hospital == null) {
            return getAllInventory();
        }
        return inventoryRepository.findByHospitalId(hospital.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Map<String, Integer> getGlobalInventorySummary() {
        String[] groups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        Map<String, Integer> summary = new LinkedHashMap<>();
        for (String bg : groups) {
            Integer total = inventoryRepository.getTotalUnitsByBloodGroup(bg);
            summary.put(bg, total != null ? total : 0);
        }
        return summary;
    }

    @Transactional
    public InventoryResponseDto updateInventory(InventoryUpdateDto dto) {
        return updateInventory(dto, null);
    }

    @Transactional
    public InventoryResponseDto updateInventory(InventoryUpdateDto dto, CustomUserDetails userDetails) {
        Hospital hospital = null;
        if (dto.getHospitalId() != null) {
            hospital = hospitalRepository.findById(dto.getHospitalId()).orElse(null);
        } else if (userDetails != null) {
            hospital = hospitalRepository.findByUserId(userDetails.getId()).orElse(null);
        }

        Optional<BloodInventory> existingOpt = (hospital != null)
                ? inventoryRepository.findByHospitalIdAndBloodGroup(hospital.getId(), dto.getBloodGroup())
                : inventoryRepository.findByBloodGroup(dto.getBloodGroup()).stream().findFirst();

        BloodInventory inventory;
        if (existingOpt.isPresent()) {
            inventory = existingOpt.get();
            inventory.setUnitsAvailable(dto.getUnitsAvailable());
            if (dto.getExpiryDate() != null) inventory.setExpiryDate(dto.getExpiryDate());
            if (dto.getStatus() != null) inventory.setStatus(dto.getStatus());
        } else {
            inventory = BloodInventory.builder()
                    .hospital(hospital)
                    .bloodGroup(dto.getBloodGroup())
                    .unitsAvailable(dto.getUnitsAvailable())
                    .expiryDate(dto.getExpiryDate() != null ? dto.getExpiryDate() : LocalDate.now().plusDays(42))
                    .status("AVAILABLE")
                    .build();
        }

        BloodInventory saved = inventoryRepository.save(inventory);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteInventoryItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventory item not found: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    private InventoryResponseDto mapToDto(BloodInventory inv) {
        boolean lowStock = inv.getUnitsAvailable() < LOW_STOCK_THRESHOLD;
        return InventoryResponseDto.builder()
                .id(inv.getId())
                .hospitalId(inv.getHospital() != null ? inv.getHospital().getId() : null)
                .hospitalName(inv.getHospital() != null ? inv.getHospital().getHospitalName() : "Central Blood Bank")
                .bloodGroup(inv.getBloodGroup())
                .unitsAvailable(inv.getUnitsAvailable())
                .expiryDate(inv.getExpiryDate())
                .status(inv.getStatus())
                .isLowStock(lowStock)
                .build();
    }
}
