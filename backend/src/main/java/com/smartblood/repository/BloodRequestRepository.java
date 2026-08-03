package com.smartblood.repository;

import com.smartblood.entity.BloodRequest;
import com.smartblood.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByRequesterId(Long requesterId);

    List<BloodRequest> findByHospitalId(Long hospitalId);

    List<BloodRequest> findByStatus(RequestStatus status);

    List<BloodRequest> findByBloodGroupAndStatus(String bloodGroup, RequestStatus status);

    long countByStatus(RequestStatus status);
}
