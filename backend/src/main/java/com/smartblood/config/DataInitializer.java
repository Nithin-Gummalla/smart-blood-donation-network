package com.smartblood.config;

import com.smartblood.entity.*;
import com.smartblood.model.EmergencyLevel;
import com.smartblood.model.RequestStatus;
import com.smartblood.model.RoleName;
import com.smartblood.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodInventoryRepository inventoryRepository;
    private final BloodRequestRepository requestRepository;
    private final DonationCampRepository campRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Roles Exist
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
            }
        }

        // Seed Admin User
        if (!userRepository.existsByEmail("admin@smartblood.org")) {
            User adminUser = User.builder()
                    .fullName("Network Administrator")
                    .email("admin@smartblood.org")
                    .password(passwordEncoder.encode("password123"))
                    .phone("1800-BLOOD-ADMIN")
                    .role(RoleName.ROLE_ADMIN)
                    .build();
            userRepository.save(adminUser);
        }

        // Seed Sample Hospital User
        User hospitalUser = null;
        if (!userRepository.existsByEmail("cityhospital@smartblood.org")) {
            hospitalUser = User.builder()
                    .fullName("City Central Hospital")
                    .email("cityhospital@smartblood.org")
                    .password(passwordEncoder.encode("password123"))
                    .phone("+1 555-0199")
                    .role(RoleName.ROLE_HOSPITAL)
                    .build();
            userRepository.save(hospitalUser);

            Hospital hospital = Hospital.builder()
                    .user(hospitalUser)
                    .hospitalName("City Central Hospital & Blood Bank")
                    .licenseNumber("HOSP-NYC-88219")
                    .address("450 Medical Center Blvd")
                    .city("New York")
                    .state("NY")
                    .contactNumber("+1 555-0199")
                    .build();
            hospitalRepository.save(hospital);

            // Seed Stock Inventory for Hospital
            String[] bloodGroups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
            int[] initialUnits = {12, 3, 18, 4, 8, 2, 25, 6};
            for (int i = 0; i < bloodGroups.length; i++) {
                inventoryRepository.save(BloodInventory.builder()
                        .hospital(hospital)
                        .bloodGroup(bloodGroups[i])
                        .unitsAvailable(initialUnits[i])
                        .expiryDate(LocalDate.now().plusDays(35 + i * 2))
                        .status("AVAILABLE")
                        .build());
            }
        }

        // Seed Sample Donor User
        if (!userRepository.existsByEmail("john.donor@smartblood.org")) {
            User donorUser = User.builder()
                    .fullName("John Doe")
                    .email("john.donor@smartblood.org")
                    .password(passwordEncoder.encode("password123"))
                    .phone("+1 555-0144")
                    .role(RoleName.ROLE_DONOR)
                    .build();
            userRepository.save(donorUser);

            Donor donor = Donor.builder()
                    .user(donorUser)
                    .bloodGroup("O+")
                    .age(28)
                    .gender("Male")
                    .address("123 Maple Street")
                    .city("New York")
                    .state("NY")
                    .pincode("10001")
                    .isAvailable(true)
                    .isEligible(true)
                    .lastDonationDate(LocalDate.now().minusMonths(4))
                    .build();
            donorRepository.save(donor);
        }

        // Seed Sample Emergency Blood Requests
        if (requestRepository.count() == 0 && hospitalUser != null) {
            Hospital hospital = hospitalRepository.findByUser(hospitalUser).orElse(null);

            requestRepository.save(BloodRequest.builder()
                    .requester(hospitalUser)
                    .hospital(hospital)
                    .patientName("Sarah Connor")
                    .bloodGroup("O-")
                    .unitsRequired(3)
                    .unitsFulfilled(1)
                    .status(RequestStatus.PENDING)
                    .emergencyLevel(EmergencyLevel.CRITICAL)
                    .city("New York")
                    .state("NY")
                    .hospitalName("City Central Hospital")
                    .requiredDate(LocalDate.now().plusDays(1))
                    .build());

            requestRepository.save(BloodRequest.builder()
                    .requester(hospitalUser)
                    .hospital(hospital)
                    .patientName("Michael Vance")
                    .bloodGroup("B+")
                    .unitsRequired(2)
                    .unitsFulfilled(2)
                    .status(RequestStatus.FULFILLED)
                    .emergencyLevel(EmergencyLevel.HIGH)
                    .city("New York")
                    .state("NY")
                    .hospitalName("City Central Hospital")
                    .requiredDate(LocalDate.now())
                    .build());
        }

        // Seed Sample Donation Camps
        if (campRepository.count() == 0) {
            campRepository.save(DonationCamp.builder()
                    .title("Metropolitan Summer Blood Drive 2026")
                    .organizer("Red Cross & Smart Blood Network")
                    .venue("Central City Community Center, Hall B")
                    .city("New York")
                    .state("NY")
                    .campDate(LocalDate.now().plusDays(5))
                    .startTime("09:00 AM")
                    .endTime("05:00 PM")
                    .contactPhone("+1 800-555-CAMP")
                    .build());

            campRepository.save(DonationCamp.builder()
                    .title("University Blood Donation Camp")
                    .organizer("Student Welfare Association")
                    .venue("State University Student Union Center")
                    .city("New York")
                    .state("NY")
                    .campDate(LocalDate.now().plusDays(12))
                    .startTime("10:00 AM")
                    .endTime("04:00 PM")
                    .contactPhone("+1 800-555-UNI")
                    .build());
        }
    }
}
