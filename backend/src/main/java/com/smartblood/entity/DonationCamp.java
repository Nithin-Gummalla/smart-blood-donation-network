package com.smartblood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "donation_camps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationCamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 150)
    private String organizer;

    @Column(nullable = false, length = 255)
    private String venue;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "camp_date", nullable = false)
    private LocalDate campDate;

    @Column(name = "start_time", nullable = false, length = 20)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 20)
    private String endTime;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;
}
