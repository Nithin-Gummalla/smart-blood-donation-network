package com.smartblood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalProfileDto {

    private Long id;
    private Long userId;
    private String hospitalName;
    private String licenseNumber;
    private String address;
    private String city;
    private String state;
    private String contactNumber;
    private String email;
}
