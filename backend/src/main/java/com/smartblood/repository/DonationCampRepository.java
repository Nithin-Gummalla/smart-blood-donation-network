package com.smartblood.repository;

import com.smartblood.entity.DonationCamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationCampRepository extends JpaRepository<DonationCamp, Long> {

    List<DonationCamp> findByCampDateGreaterThanEqualOrderByCampDateAsc(LocalDate date);

    List<DonationCamp> findByCityIgnoreCase(String city);
}
