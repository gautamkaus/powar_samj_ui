package com.powar.controller;

import com.powar.dto.AuthRequest;
import com.powar.dto.AuthResponse;
import com.powar.dto.RegisterRequest;
import com.powar.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    /**
     * User login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            logger.info("Login attempt for user: {}", authRequest.getUsername());
            
            AuthResponse authResponse = authService.login(authRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", authResponse);
            response.put("source", "java-backend");
            
            logger.info("Login successful for user: {}", authRequest.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Login failed for user: {}", authRequest.getUsername(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Login failed: " + e.getMessage());
            errorResponse.put("source", "java-backend");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * User registration endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            logger.info("Registration attempt for user: {}", registerRequest.getUsername());
            
            AuthResponse authResponse = authService.register(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("data", authResponse);
            response.put("source", "java-backend");
            
            logger.info("Registration successful for user: {}", registerRequest.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Registration failed: " + e.getMessage());
            errorResponse.put("source", "java-backend");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Refresh token endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Invalid authorization header");
            }
            
            String token = authHeader.substring(7);
            logger.info("Token refresh attempt");
            
            AuthResponse authResponse = authService.refreshToken(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token refreshed successfully");
            response.put("data", authResponse);
            response.put("source", "java-backend");
            
            logger.info("Token refreshed successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Token refresh failed: " + e.getMessage());
            errorResponse.put("source", "java-backend");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Invalid authorization header");
            }
            
            String token = authHeader.substring(7);
            logger.info("Logout attempt");
            
            authService.logout(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Logout successful");
            response.put("source", "java-backend");
            
            logger.info("Logout successful");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Logout failed", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Logout failed: " + e.getMessage());
            errorResponse.put("source", "java-backend");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Validate token endpoint
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Invalid authorization header");
            }
            
            String token = authHeader.substring(7);
            logger.info("Token validation attempt");
            
            boolean isValid = authService.validateToken(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token validation completed");
            response.put("data", Map.of("valid", isValid));
            response.put("source", "java-backend");
            
            logger.info("Token validation completed. Valid: {}", isValid);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Token validation failed: " + e.getMessage());
            errorResponse.put("source", "java-backend");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
