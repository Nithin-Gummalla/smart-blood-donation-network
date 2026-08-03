package com.smartblood.service;

import com.smartblood.dto.DonationHistoryDto;
import com.smartblood.dto.DonorProfileDto;
import com.smartblood.entity.DonationHistory;
import com.smartblood.entity.Donor;
import com.smartblood.entity.User;
import com.smartblood.exception.ResourceNotFoundException;
import com.smartblood.repository.DonationHistoryRepository;
import com.smartblood.repository.DonorRepository;
import com.smartblood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;
    private final DonationHistoryRepository donationHistoryRepository;

    public List<DonorProfileDto> searchDonors(String bloodGroup, String city, String state, Boolean isAvailable) {
        String cleanBloodGroup = (bloodGroup != null && !bloodGroup.isBlank()) ? bloodGroup.trim() : null;
        String cleanCity = (city != null && !city.isBlank()) ? city.trim() : null;
        String cleanState = (state != null && !state.isBlank()) ? state.trim() : null;

        List<Donor> donors = donorRepository.searchDonors(cleanBloodGroup, cleanCity, cleanState, isAvailable);
        return donors.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public DonorProfileDto getDonorProfileByUserId(Long userId) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user ID: " + userId));
        return mapToDto(donor);
    }

    @Transactional
    public DonorProfileDto updateDonorProfile(Long userId, DonorProfileDto dto) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user ID: " + userId));

        User user = donor.getUser();
        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getBloodGroup() != null) donor.setBloodGroup(dto.getBloodGroup());
        if (dto.getAge() != null) donor.setAge(dto.getAge());
        if (dto.getGender() != null) donor.setGender(dto.getGender());
        if (dto.getAddress() != null) donor.setAddress(dto.getAddress());
        if (dto.getCity() != null) donor.setCity(dto.getCity());
        if (dto.getState() != null) donor.setState(dto.getState());
        if (dto.getPincode() != null) donor.setPincode(dto.getPincode());
        if (dto.getIsAvailable() != null) donor.setIsAvailable(dto.getIsAvailable());
        if (dto.getLastDonationDate() != null) {
            donor.setLastDonationDate(dto.getLastDonationDate());
            // Calculate eligibility: Eligible if last donation date was >= 90 days ago
            donor.setIsEligible(dto.getLastDonationDate().plusDays(90).isBefore(LocalDate.now()) ||
                                dto.getLastDonationDate().plusDays(90).isEqual(LocalDate.now()));
        }

        Donor updated = donorRepository.save(donor);
        return mapToDto(updated);
    }

    public List<DonationHistoryDto> getDonationHistory(Long userId) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found for user ID: " + userId));

        return donationHistoryRepository.findByDonorIdOrderByDonationDateDesc(donor.getId())
                .stream()
                .map(dh -> DonationHistoryDto.builder()
                        .id(dh.getId())
                        .donorId(dh.getDonor().getId())
                        .hospitalOrCamp(dh.getHospitalOrCamp())
                        .donationDate(dh.getDonationDate())
                        .unitsDonated(dh.getUnitsDonated())
                        .status(dh.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public DonationHistoryDto addDonationRecord(Long userId, String hospitalOrCamp, Integer units) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found for user ID: " + userId));

        DonationHistory history = DonationHistory.builder()
                .donor(donor)
                .hospitalOrCamp(hospitalOrCamp)
                .donationDate(LocalDate.now())
                .unitsDonated(units != null ? units : 1)
                .status("COMPLETED")
                .build();

        donationHistoryRepository.save(history);

        donor.setLastDonationDate(LocalDate.now());
        donor.setIsEligible(false);
        donorRepository.save(donor);

        return DonationHistoryDto.builder()
                .id(history.getId())
                .donorId(donor.getId())
                .hospitalOrCamp(history.getHospitalOrCamp())
                .donationDate(history.getDonationDate())
                .unitsDonated(history.getUnitsDonated())
                .status(history.getStatus())
                .build();
    }

    private DonorProfileDto mapToDto(Donor d) {
        return DonorProfileDto.builder()
                .id(d.getId())
                .userId(d.getUser().getId())
                .fullName(d.getUser().getFullName())
                .email(d.getUser().getEmail())
                .phone(d.getUser().getPhone())
                .bloodGroup(d.getBloodGroup())
                .age(d.getAge())
                .gender(d.getGender())
                .address(d.getAddress())
                .city(d.getCity())
                .state(d.getState())
                .pincode(d.getPincode())
                .isAvailable(d.getIsAvailable())
                .isEligible(d.getIsEligible())
                .lastDonationDate(d.getLastDonationDate())
                .build();
    }
}
