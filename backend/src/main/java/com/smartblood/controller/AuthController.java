package com.smartblood.controller;

import com.smartblood.dto.ApiResponse;
import com.smartblood.dto.JwtResponse;
import com.smartblood.dto.LoginRequest;
import com.smartblood.dto.RegisterRequest;
import com.smartblood.entity.User;
import com.smartblood.repository.UserRepository;
import com.smartblood.security.CustomUserDetails;
import com.smartblood.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user login, registration, and user context")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    @Operation(summary = "Login with email and password", description = "Returns JWT token and user profile")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Supports DONOR, HOSPITAL, or ADMIN registration")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        ApiResponse<String> response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user details")
    public ResponseEntity<ApiResponse<JwtResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        }

        Object profileDetails = authService.getProfileDetails(user);
        JwtResponse response = JwtResponse.builder()
                .token(null)
                .type("Bearer")
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileDetails(profileDetails)
                .build();

        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", response));
    }
}
