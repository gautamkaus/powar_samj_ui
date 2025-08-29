package com.powar.dto;

import java.time.LocalDateTime;

public class AuthResponse {
    
    private String token;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private LocalDateTime issuedAt;
    private UserInfo user;
    
    // Default constructor
    public AuthResponse() {}
    
    // Constructor with parameters
    public AuthResponse(String token, String refreshToken, String tokenType, Long expiresIn, UserInfo user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.issuedAt = LocalDateTime.now();
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Long getExpiresIn() {
        return expiresIn;
    }
    
    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
    
    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }
    
    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
    
    public UserInfo getUser() {
        return user;
    }
    
    public void setUser(UserInfo user) {
        this.user = user;
    }
    
    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='[PROTECTED]'" +
                ", refreshToken='[PROTECTED]'" +
                ", tokenType='" + tokenType + '\'' +
                ", expiresIn=" + expiresIn +
                ", issuedAt=" + issuedAt +
                ", user=" + user +
                '}';
    }
    
    // Inner class for user information
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String profilePicture;
        private String bio;
        private Long communityId;
        private String communityName;
        
        // Default constructor
        public UserInfo() {}
        
        // Constructor with parameters
        public UserInfo(Long id, String username, String email, String firstName, String lastName) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public String getProfilePicture() {
            return profilePicture;
        }
        
        public void setProfilePicture(String profilePicture) {
            this.profilePicture = profilePicture;
        }
        
        public String getBio() {
            return bio;
        }
        
        public void setBio(String bio) {
            this.bio = bio;
        }
        
        public Long getCommunityId() {
            return communityId;
        }
        
        public void setCommunityId(Long communityId) {
            this.communityId = communityId;
        }
        
        public String getCommunityName() {
            return communityName;
        }
        
        public void setCommunityName(String communityName) {
            this.communityName = communityName;
        }
        
        @Override
        public String toString() {
            return "UserInfo{" +
                    "id=" + id +
                    ", username='" + username + '\'' +
                    ", email='" + email + '\'' +
                    ", firstName='" + firstName + '\'' +
                    ", lastName='" + lastName + '\'' +
                    ", profilePicture='" + profilePicture + '\'' +
                    ", bio='" + bio + '\'' +
                    ", communityId=" + communityId +
                    ", communityName='" + communityName + '\'' +
                    '}';
        }
    }
}
