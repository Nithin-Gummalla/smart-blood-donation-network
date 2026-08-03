package com.smartblood.service;

import com.smartblood.dto.BloodRequestResponseDto;
import com.smartblood.dto.CreateBloodRequestDto;
import com.smartblood.dto.UpdateRequestStatusDto;
import com.smartblood.entity.BloodRequest;
import com.smartblood.entity.Hospital;
import com.smartblood.entity.User;
import com.smartblood.exception.BadRequestException;
import com.smartblood.exception.ResourceNotFoundException;
import com.smartblood.model.RequestStatus;
import com.smartblood.repository.BloodRequestRepository;
import com.smartblood.repository.HospitalRepository;
import com.smartblood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final NotificationService notificationService;

    @Transactional
    public BloodRequestResponseDto createRequest(Long userId, CreateBloodRequestDto dto) {
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Hospital hospital = null;
        if (dto.getHospitalId() != null) {
            hospital = hospitalRepository.findById(dto.getHospitalId()).orElse(null);
        } else {
            hospital = hospitalRepository.findByUserId(userId).orElse(null);
        }

        BloodRequest request = BloodRequest.builder()
                .requester(requester)
                .hospital(hospital)
                .patientName(dto.getPatientName())
                .bloodGroup(dto.getBloodGroup())
                .unitsRequired(dto.getUnitsRequired())
                .unitsFulfilled(0)
                .status(RequestStatus.PENDING)
                .emergencyLevel(dto.getEmergencyLevel())
                .city(dto.getCity())
                .state(dto.getState())
                .hospitalName(dto.getHospitalName())
                .requiredDate(dto.getRequiredDate())
                .build();

        BloodRequest saved = bloodRequestRepository.save(request);

        // Broadcast notification
        notificationService.createNotification(
                requester,
                "Blood Request Created",
                "Your request for " + dto.getUnitsRequired() + " units of " + dto.getBloodGroup() + " blood has been published.",
                "REQUEST"
        );

        return mapToDto(saved);
    }

    public List<BloodRequestResponseDto> getAllRequests() {
        return bloodRequestRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<BloodRequestResponseDto> getRequestsByStatus(RequestStatus status) {
        return bloodRequestRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<BloodRequestResponseDto> getRequestsByRequester(Long userId) {
        return bloodRequestRepository.findByRequesterId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BloodRequestResponseDto getRequestById(Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found: " + id));
        return mapToDto(request);
    }

    @Transactional
    public BloodRequestResponseDto updateRequestStatus(Long requestId, UpdateRequestStatusDto dto, Long currentUserId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found: " + requestId));

        request.setStatus(dto.getStatus());
        if (dto.getUnitsFulfilled() != null) {
            request.setUnitsFulfilled(dto.getUnitsFulfilled());
            if (request.getUnitsFulfilled() >= request.getUnitsRequired()) {
                request.setStatus(RequestStatus.FULFILLED);
            }
        }

        BloodRequest updated = bloodRequestRepository.save(request);

        notificationService.createNotification(
                request.getRequester(),
                "Blood Request Update",
                "Your request status has been updated to " + updated.getStatus() + ".",
                "REQUEST"
        );

        return mapToDto(updated);
    }

    @Transactional
    public void cancelRequest(Long requestId, Long userId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found: " + requestId));

        if (!request.getRequester().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own requests.");
        }

        request.setStatus(RequestStatus.CANCELLED);
        bloodRequestRepository.save(request);
    }

    public BloodRequestResponseDto mapToDto(BloodRequest br) {
        return BloodRequestResponseDto.builder()
                .id(br.getId())
                .requesterId(br.getRequester().getId())
                .requesterName(br.getRequester().getFullName())
                .requesterEmail(br.getRequester().getEmail())
                .requesterPhone(br.getRequester().getPhone())
                .hospitalId(br.getHospital() != null ? br.getHospital().getId() : null)
                .patientName(br.getPatientName())
                .bloodGroup(br.getBloodGroup())
                .unitsRequired(br.getUnitsRequired())
                .unitsFulfilled(br.getUnitsFulfilled())
                .status(br.getStatus())
                .emergencyLevel(br.getEmergencyLevel())
                .city(br.getCity())
                .state(br.getState())
                .hospitalName(br.getHospitalName())
                .requiredDate(br.getRequiredDate())
                .createdAt(br.getCreatedAt())
                .build();
    }
}
