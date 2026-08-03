package com.smartblood.repository;

import com.smartblood.entity.Hospital;
import com.smartblood.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByUser(User user);

    Optional<Hospital> findByUserId(Long userId);

    Boolean existsByLicenseNumber(String licenseNumber);
}
