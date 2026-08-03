package com.smartblood.service;

import com.smartblood.dto.HospitalProfileDto;
import com.smartblood.entity.Hospital;
import com.smartblood.entity.User;
import com.smartblood.exception.ResourceNotFoundException;
import com.smartblood.repository.HospitalRepository;
import com.smartblood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;

    public List<HospitalProfileDto> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public HospitalProfileDto getHospitalByUserId(Long userId) {
        Hospital hospital = hospitalRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found for user ID: " + userId));
        return mapToDto(hospital);
    }

    @Transactional
    public HospitalProfileDto updateHospitalProfile(Long userId, HospitalProfileDto dto) {
        Hospital hospital = hospitalRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found for user ID: " + userId));

        User user = hospital.getUser();
        if (dto.getHospitalName() != null) hospital.setHospitalName(dto.getHospitalName());
        if (dto.getLicenseNumber() != null) hospital.setLicenseNumber(dto.getLicenseNumber());
        if (dto.getAddress() != null) hospital.setAddress(dto.getAddress());
        if (dto.getCity() != null) hospital.setCity(dto.getCity());
        if (dto.getState() != null) hospital.setState(dto.getState());
        if (dto.getContactNumber() != null) hospital.setContactNumber(dto.getContactNumber());

        hospitalRepository.save(hospital);
        return mapToDto(hospital);
    }

    public HospitalProfileDto mapToDto(Hospital h) {
        return HospitalProfileDto.builder()
                .id(h.getId())
                .userId(h.getUser().getId())
                .hospitalName(h.getHospitalName())
                .licenseNumber(h.getLicenseNumber())
                .address(h.getAddress())
                .city(h.getCity())
                .state(h.getState())
                .contactNumber(h.getContactNumber())
                .email(h.getUser().getEmail())
                .build();
    }
}
