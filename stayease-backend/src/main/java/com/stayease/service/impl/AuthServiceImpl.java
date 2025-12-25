package com.stayease.service.impl;

import com.stayease.dto.request.LoginRequest;
import com.stayease.dto.request.RegisterRequest;
import com.stayease.dto.response.JwtResponse;
import com.stayease.dto.response.UserResponse;
import com.stayease.entity.OwnerProfile;
import com.stayease.entity.User;
import com.stayease.enums.Role;
import com.stayease.exception.BadRequestException;
import com.stayease.exception.DuplicateResourceException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.OwnerProfileRepository;
import com.stayease.repository.UserRepository;
import com.stayease.security.CustomUserDetails;
import com.stayease.security.JwtTokenProvider;
import com.stayease.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return JwtResponse.builder()
            .accessToken(jwt)
            .tokenType("Bearer")
            .expiresIn(jwtTokenProvider.getExpirationTime())
            .user(mapToUserResponse(user))
            .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        validateRegistration(registerRequest);

        User user = User.builder()
            .email(registerRequest.getEmail())
            .password(passwordEncoder.encode(registerRequest.getPassword()))
            .firstName(registerRequest.getFirstName())
            .lastName(registerRequest.getLastName())
            .phone(registerRequest.getPhone())
            .role(Role.USER)
            .isActive(true)
            .isVerified(false)
            .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse registerOwner(RegisterRequest registerRequest) {
        validateRegistration(registerRequest);

        User user = User.builder()
            .email(registerRequest.getEmail())
            .password(passwordEncoder.encode(registerRequest.getPassword()))
            .firstName(registerRequest.getFirstName())
            .lastName(registerRequest.getLastName())
            .phone(registerRequest.getPhone())
            .role(Role.OWNER)
            .isActive(true)
            .isVerified(false)
            .build();

        User savedUser = userRepository.save(user);

        
        OwnerProfile ownerProfile = OwnerProfile.builder()
            .user(savedUser)
            .build();
        ownerProfileRepository.save(ownerProfile);

        return mapToUserResponse(savedUser);
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    private void validateRegistration(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already registered");
        }
        if (request.getPassword() == null || request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .phone(user.getPhone())
            .profileImageUrl(user.getProfileImageUrl())
            .role(user.getRole())
            .isVerified(user.getIsVerified())
            .createdAt(user.getCreatedAt())
            .build();
    }
}