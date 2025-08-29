package com.powar.service.impl;

import com.powar.dto.AuthRequest;
import com.powar.dto.AuthResponse;
import com.powar.dto.RegisterRequest;
import com.powar.service.AuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthServiceImpl implements AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private Long jwtExpiration;
    
    private final PasswordEncoder passwordEncoder;
    private final SecretKey secretKey;
    
    // In-memory storage for demo purposes (in production, use Redis or database)
    private final Map<String, String> userCredentials = new ConcurrentHashMap<>();
    private final Map<String, String> refreshTokens = new ConcurrentHashMap<>();
    private final Map<String, Boolean> blacklistedTokens = new ConcurrentHashMap<>();
    
    public AuthServiceImpl(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        // Initialize with some demo users
        initializeDemoUsers();
    }
    
    @Override
    public AuthResponse login(AuthRequest authRequest) {
        try {
            logger.info("Processing login for user: {}", authRequest.getUsername());
            
            // Check if user exists and password matches
            String storedPassword = userCredentials.get(authRequest.getUsername());
            if (storedPassword == null || !passwordEncoder.matches(authRequest.getPassword(), storedPassword)) {
                throw new RuntimeException("Invalid username or password");
            }
            
            // Create user info (in production, fetch from database)
            AuthResponse.UserInfo userInfo = createUserInfo(authRequest.getUsername());
            
            // Generate JWT tokens
            String accessToken = generateAccessToken(userInfo);
            String refreshToken = generateRefreshToken(userInfo);
            
            // Store refresh token
            refreshTokens.put(refreshToken, userInfo.getUsername());
            
            logger.info("Login successful for user: {}", authRequest.getUsername());
            
            return new AuthResponse(accessToken, refreshToken, "Bearer", jwtExpiration, userInfo);
            
        } catch (Exception e) {
            logger.error("Login failed for user: {}", authRequest.getUsername(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }
    
    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        try {
            logger.info("Processing registration for user: {}", registerRequest.getUsername());
            
            // Check if username already exists
            if (userCredentials.containsKey(registerRequest.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            
            // Check if email already exists (in production, check database)
            if (userCredentials.containsValue(registerRequest.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            
            // Hash password and store user credentials
            String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
            userCredentials.put(registerRequest.getUsername(), hashedPassword);
            
            // Create user info
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                1L, // In production, get from database
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getFirstName(),
                registerRequest.getLastName()
            );
            userInfo.setBio(registerRequest.getBio());
            userInfo.setCommunityId(registerRequest.getCommunityId());
            
            // Generate JWT tokens
            String accessToken = generateAccessToken(userInfo);
            String refreshToken = generateRefreshToken(userInfo);
            
            // Store refresh token
            refreshTokens.put(refreshToken, userInfo.getUsername());
            
            logger.info("Registration successful for user: {}", registerRequest.getUsername());
            
            return new AuthResponse(accessToken, refreshToken, "Bearer", jwtExpiration, userInfo);
            
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        try {
            logger.info("Processing token refresh");
            
            // Validate refresh token
            if (!refreshTokens.containsKey(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }
            
            String username = refreshTokens.get(refreshToken);
            
            // Create user info
            AuthResponse.UserInfo userInfo = createUserInfo(username);
            
            // Generate new JWT tokens
            String newAccessToken = generateAccessToken(userInfo);
            String newRefreshToken = generateRefreshToken(userInfo);
            
            // Remove old refresh token and store new one
            refreshTokens.remove(refreshToken);
            refreshTokens.put(newRefreshToken, username);
            
            logger.info("Token refresh successful for user: {}", username);
            
            return new AuthResponse(newAccessToken, newRefreshToken, "Bearer", jwtExpiration, userInfo);
            
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            throw new RuntimeException("Token refresh failed: " + e.getMessage());
        }
    }
    
    @Override
    public void logout(String token) {
        try {
            logger.info("Processing logout");
            
            // Add token to blacklist
            blacklistedTokens.put(token, true);
            
            // Extract username from token and remove refresh token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            String username = claims.getSubject();
            
            // Remove refresh token for this user
            refreshTokens.entrySet().removeIf(entry -> entry.getValue().equals(username));
            
            logger.info("Logout successful for user: {}", username);
            
        } catch (Exception e) {
            logger.error("Logout failed", e);
            throw new RuntimeException("Logout failed: " + e.getMessage());
        }
    }
    
    @Override
    public boolean validateToken(String token) {
        try {
            // Check if token is blacklisted
            if (blacklistedTokens.containsKey(token)) {
                return false;
            }
            
            // Validate JWT token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            // Check if token is expired
            return !claims.getExpiration().before(new Date());
            
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return false;
        }
    }
    
    private String generateAccessToken(AuthResponse.UserInfo userInfo) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userInfo.getId());
        claims.put("username", userInfo.getUsername());
        claims.put("email", userInfo.getEmail());
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userInfo.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }
    
    private String generateRefreshToken(AuthResponse.UserInfo userInfo) {
        return Jwts.builder()
                .setSubject(userInfo.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (jwtExpiration * 7))) // 7 times longer
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }
    
    private AuthResponse.UserInfo createUserInfo(String username) {
        // In production, fetch from database
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
            1L, // In production, get from database
            username,
            username + "@example.com", // In production, get from database
            "Demo", // In production, get from database
            "User"  // In production, get from database
        );
        userInfo.setBio("Demo user bio");
        userInfo.setCommunityId(1L);
        userInfo.setCommunityName("Demo Community");
        return userInfo;
    }
    
    private void initializeDemoUsers() {
        // Add some demo users for testing
        userCredentials.put("admin", passwordEncoder.encode("admin123"));
        userCredentials.put("user1", passwordEncoder.encode("user123"));
        userCredentials.put("user2", passwordEncoder.encode("user123"));
        
        logger.info("Demo users initialized");
    }
}
