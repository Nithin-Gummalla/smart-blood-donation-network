package com.smartblood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "donation_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(name = "hospital_or_camp", nullable = false, length = 150)
    private String hospitalOrCamp;

    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    @Column(name = "units_donated", nullable = false)
    private Integer unitsDonated = 1;

    @Column(length = 30)
    private String status = "COMPLETED";
}
