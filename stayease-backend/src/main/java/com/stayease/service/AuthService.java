package com.stayease.service;

import com.stayease.dto.request.LoginRequest;
import com.stayease.dto.request.RegisterRequest;
import com.stayease.dto.response.JwtResponse;
import com.stayease.dto.response.UserResponse;

public interface AuthService {
    
    JwtResponse login(LoginRequest loginRequest);
    
    UserResponse register(RegisterRequest registerRequest);
    
    UserResponse registerOwner(RegisterRequest registerRequest);
    
    UserResponse getCurrentUser(String email);
}