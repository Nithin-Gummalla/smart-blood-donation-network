package com.smartblood.repository;

import com.smartblood.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {

    List<BloodInventory> findByHospitalId(Long hospitalId);

    Optional<BloodInventory> findByHospitalIdAndBloodGroup(Long hospitalId, String bloodGroup);

    List<BloodInventory> findByBloodGroup(String bloodGroup);

    @Query("SELECT SUM(i.unitsAvailable) FROM BloodInventory i WHERE i.bloodGroup = :bloodGroup")
    Integer getTotalUnitsByBloodGroup(String bloodGroup);

    @Query("SELECT SUM(i.unitsAvailable) FROM BloodInventory i")
    Long getTotalUnitsAvailable();
}
