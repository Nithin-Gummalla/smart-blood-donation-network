package com.smartblood.service;

import com.smartblood.dto.*;
import com.smartblood.model.RequestStatus;
import com.smartblood.model.RoleName;
import com.smartblood.repository.BloodInventoryRepository;
import com.smartblood.repository.BloodRequestRepository;
import com.smartblood.repository.DonorRepository;
import com.smartblood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository requestRepository;
    private final BloodInventoryRepository inventoryRepository;
    private final DonorService donorService;
    private final HospitalService hospitalService;
    private final BloodInventoryService inventoryService;
    private final BloodRequestService requestService;

    public AdminDashboardStatsDto getAdminStats() {
        long totalDonors = userRepository.countByRole(RoleName.ROLE_DONOR);
        long activeDonors = donorRepository.countByIsAvailable(true);
        long totalHospitals = userRepository.countByRole(RoleName.ROLE_HOSPITAL);
        long totalRequests = requestRepository.count();
        long fulfilledRequests = requestRepository.countByStatus(RequestStatus.FULFILLED);
        long pendingRequests = requestRepository.countByStatus(RequestStatus.PENDING);
        Long totalUnits = inventoryRepository.getTotalUnitsAvailable();

        Map<String, Integer> summary = inventoryService.getGlobalInventorySummary();
        long lowStockCount = summary.values().stream().filter(units -> units < 5).count();

        return AdminDashboardStatsDto.builder()
                .totalDonors(totalDonors)
                .activeDonors(activeDonors)
                .totalHospitals(totalHospitals)
                .totalBloodRequests(totalRequests)
                .fulfilledRequests(fulfilledRequests)
                .pendingRequests(pendingRequests)
                .totalInventoryUnits(totalUnits != null ? totalUnits : 0)
                .inventoryByBloodGroup(summary)
                .lowStockAlertsCount(lowStockCount)
                .build();
    }

    public DonorDashboardStatsDto getDonorDashboard(Long userId) {
        DonorProfileDto profile = donorService.getDonorProfileByUserId(userId);
        List<DonationHistoryDto> history = donorService.getDonationHistory(userId);

        int profileScore = 40;
        if (profile.getBloodGroup() != null) profileScore += 15;
        if (profile.getPhone() != null) profileScore += 15;
        if (profile.getCity() != null) profileScore += 15;
        if (profile.getAddress() != null) profileScore += 15;

        LocalDate nextEligible = (profile.getLastDonationDate() != null)
                ? profile.getLastDonationDate().plusDays(90)
                : LocalDate.now();

        List<BloodRequestResponseDto> nearbyUrgent = requestService.getRequestsByStatus(RequestStatus.PENDING);

        return DonorDashboardStatsDto.builder()
                .profile(profile)
                .profileCompletionPercentage(profileScore)
                .totalDonationsCount(history.size())
                .isEligibleToDonate(profile.getIsEligible())
                .nextEligibleDate(nextEligible)
                .nearbyUrgentRequests(nearbyUrgent)
                .build();
    }

    public HospitalDashboardStatsDto getHospitalDashboard(Long userId) {
        HospitalProfileDto profile = hospitalService.getHospitalByUserId(userId);
        List<InventoryResponseDto> inventory = inventoryService.getInventoryByHospitalUser(userId);
        List<BloodRequestResponseDto> pending = requestService.getRequestsByStatus(RequestStatus.PENDING);

        long activeRequestsCount = requestRepository.countByStatus(RequestStatus.PENDING);
        long approvedRequestsCount = requestRepository.countByStatus(RequestStatus.APPROVED);
        long totalStock = inventory.stream().mapToLong(InventoryResponseDto::getUnitsAvailable).sum();

        return HospitalDashboardStatsDto.builder()
                .profile(profile)
                .activeRequestsCount(activeRequestsCount)
                .approvedRequestsCount(approvedRequestsCount)
                .totalBloodUnitsInStock(totalStock)
                .inventoryList(inventory)
                .pendingRequests(pending)
                .build();
    }
}
