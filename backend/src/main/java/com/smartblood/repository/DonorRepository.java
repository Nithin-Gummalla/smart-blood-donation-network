package com.smartblood.repository;

import com.smartblood.entity.Donor;
import com.smartblood.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long>, JpaSpecificationExecutor<Donor> {

    Optional<Donor> findByUser(User user);

    Optional<Donor> findByUserId(Long userId);

    @Query("SELECT d FROM Donor d WHERE " +
           "(:bloodGroup IS NULL OR d.bloodGroup = :bloodGroup) AND " +
           "(:city IS NULL OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:state IS NULL OR LOWER(d.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
           "(:isAvailable IS NULL OR d.isAvailable = :isAvailable)")
    List<Donor> searchDonors(@Param("bloodGroup") String bloodGroup,
                            @Param("city") String city,
                            @Param("state") String state,
                            @Param("isAvailable") Boolean isAvailable);

    long countByIsAvailable(Boolean isAvailable);
}
