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
public class DonorProfileDto {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String bloodGroup;
    private Integer age;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Boolean isAvailable;
    private Boolean isEligible;
    private LocalDate lastDonationDate;
}
