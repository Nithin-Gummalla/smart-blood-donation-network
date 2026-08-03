package com.smartblood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationCampDto {

    private Long id;
    private String title;
    private String organizer;
    private String venue;
    private String city;
    private String state;
    private LocalDate campDate;
    private String startTime;
    private String endTime;
    private String contactPhone;
}
