package com.powar.service;

import com.powar.dto.AuthRequest;
import com.powar.dto.AuthResponse;
import com.powar.dto.RegisterRequest;

public interface AuthService {
    
    /**
     * Authenticate user and return JWT token
     */
    AuthResponse login(AuthRequest authRequest);
    
    /**
     * Register new user and return JWT token
     */
    AuthResponse register(RegisterRequest registerRequest);
    
    /**
     * Refresh JWT token
     */
    AuthResponse refreshToken(String refreshToken);
    
    /**
     * Logout user (invalidate token)
     */
    void logout(String token);
    
    /**
     * Validate JWT token
     */
    boolean validateToken(String token);
}
