package com.smartblood.service;

import com.smartblood.dto.*;
import com.smartblood.entity.*;
import com.smartblood.exception.BadRequestException;
import com.smartblood.exception.ResourceNotFoundException;
import com.smartblood.model.RoleName;
import com.smartblood.repository.*;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final BloodInventoryRepository inventoryRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Object profileDetails = getProfileDetails(user);

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileDetails(profileDetails)
                .build();
    }

    @Transactional
    public ApiResponse<String> registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already registered!");
        }

        RoleName roleName = registerRequest.getRole() != null ? registerRequest.getRole() : RoleName.ROLE_DONOR;

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phone(registerRequest.getPhone())
                .role(roleName)
                .build();

        userRepository.save(user);

        // Populate role-specific entity
        if (roleName == RoleName.ROLE_DONOR) {
            Donor donor = Donor.builder()
                    .user(user)
                    .bloodGroup(registerRequest.getBloodGroup() != null ? registerRequest.getBloodGroup() : "O+")
                    .age(registerRequest.getAge() != null ? registerRequest.getAge() : 25)
                    .gender(registerRequest.getGender() != null ? registerRequest.getGender() : "Not Specified")
                    .address(registerRequest.getAddress())
                    .city(registerRequest.getCity() != null ? registerRequest.getCity() : "New York")
                    .state(registerRequest.getState() != null ? registerRequest.getState() : "NY")
                    .pincode(registerRequest.getPincode())
                    .isAvailable(true)
                    .isEligible(true)
                    .lastDonationDate(LocalDate.now().minusMonths(4))
                    .build();
            donorRepository.save(donor);
        } else if (roleName == RoleName.ROLE_HOSPITAL) {
            Hospital hospital = Hospital.builder()
                    .user(user)
                    .hospitalName(registerRequest.getHospitalName() != null ? registerRequest.getHospitalName() : registerRequest.getFullName())
                    .licenseNumber(registerRequest.getLicenseNumber() != null ? registerRequest.getLicenseNumber() : "LIC-" + System.currentTimeMillis())
                    .address(registerRequest.getAddress())
                    .city(registerRequest.getCity() != null ? registerRequest.getCity() : "New York")
                    .state(registerRequest.getState() != null ? registerRequest.getState() : "NY")
                    .contactNumber(registerRequest.getPhone() != null ? registerRequest.getPhone() : "555-0199")
                    .build();
            hospitalRepository.save(hospital);
        }

        return ApiResponse.success("User registered successfully!");
    }

    public Object getProfileDetails(User user) {
        if (user.getRole() == RoleName.ROLE_DONOR) {
            return donorRepository.findByUser(user)
                    .map(d -> DonorProfileDto.builder()
                            .id(d.getId())
                            .userId(user.getId())
                            .fullName(user.getFullName())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .bloodGroup(d.getBloodGroup())
                            .age(d.getAge())
                            .gender(d.getGender())
                            .address(d.getAddress())
                            .city(d.getCity())
                            .state(d.getState())
                            .pincode(d.getPincode())
                            .isAvailable(d.getIsAvailable())
                            .isEligible(d.getIsEligible())
                            .lastDonationDate(d.getLastDonationDate())
                            .build())
                    .orElse(null);
        } else if (user.getRole() == RoleName.ROLE_HOSPITAL) {
            return hospitalRepository.findByUser(user)
                    .map(h -> HospitalProfileDto.builder()
                            .id(h.getId())
                            .userId(user.getId())
                            .hospitalName(h.getHospitalName())
                            .licenseNumber(h.getLicenseNumber())
                            .address(h.getAddress())
                            .city(h.getCity())
                            .state(h.getState())
                            .contactNumber(h.getContactNumber())
                            .email(user.getEmail())
                            .build())
                    .orElse(null);
        }
        return null;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // 1. Delete associated donor and its donation history if present
        donorRepository.findByUserId(userId).ifPresent(donor -> {
            donationHistoryRepository.deleteByDonorId(donor.getId());
            donorRepository.delete(donor);
        });

        // 2. Delete associated hospital if present
        hospitalRepository.findByUserId(userId).ifPresent(hospital -> {
            inventoryRepository.findByHospitalId(hospital.getId()).forEach(inv -> {
                inv.setHospital(null);
                inventoryRepository.save(inv);
            });
            bloodRequestRepository.findByHospitalId(hospital.getId()).forEach(req -> {
                req.setHospital(null);
                bloodRequestRepository.save(req);
            });
            hospitalRepository.delete(hospital);
        });

        // 3. Delete blood requests created by this user
        bloodRequestRepository.findByRequesterId(userId).forEach(bloodRequestRepository::delete);

        // 4. Delete notifications for this user
        notificationRepository.deleteByUserId(userId);

        // 5. Delete the user
        userRepository.delete(user);
    }
}
