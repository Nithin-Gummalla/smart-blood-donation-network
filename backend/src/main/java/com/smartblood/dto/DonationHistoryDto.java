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
public class DonationHistoryDto {

    private Long id;
    private Long donorId;
    private String hospitalOrCamp;
    private LocalDate donationDate;
    private Integer unitsDonated;
    private String status;
}
