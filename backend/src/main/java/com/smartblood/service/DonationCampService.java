package com.smartblood.service;

import com.smartblood.dto.DonationCampDto;
import com.smartblood.entity.DonationCamp;
import com.smartblood.exception.ResourceNotFoundException;
import com.smartblood.repository.DonationCampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationCampService {

    private final DonationCampRepository campRepository;

    public List<DonationCampDto> getUpcomingCamps() {
        return campRepository.findByCampDateGreaterThanEqualOrderByCampDateAsc(LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<DonationCampDto> getAllCamps() {
        return campRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DonationCampDto createCamp(DonationCampDto dto) {
        DonationCamp camp = DonationCamp.builder()
                .title(dto.getTitle())
                .organizer(dto.getOrganizer())
                .venue(dto.getVenue())
                .city(dto.getCity())
                .state(dto.getState())
                .campDate(dto.getCampDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .contactPhone(dto.getContactPhone())
                .build();

        DonationCamp saved = campRepository.save(camp);
        return mapToDto(saved);
    }

    public void deleteCamp(Long id) {
        if (!campRepository.existsById(id)) {
            throw new ResourceNotFoundException("Camp not found with ID: " + id);
        }
        campRepository.deleteById(id);
    }

    private DonationCampDto mapToDto(DonationCamp camp) {
        return DonationCampDto.builder()
                .id(camp.getId())
                .title(camp.getTitle())
                .organizer(camp.getOrganizer())
                .venue(camp.getVenue())
                .city(camp.getCity())
                .state(camp.getState())
                .campDate(camp.getCampDate())
                .startTime(camp.getStartTime())
                .endTime(camp.getEndTime())
                .contactPhone(camp.getContactPhone())
                .build();
    }
}
