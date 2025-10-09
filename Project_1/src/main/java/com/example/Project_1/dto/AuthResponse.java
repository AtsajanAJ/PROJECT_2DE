package com.example.Project_1.dto;

/**
 * DTO for authentication response
 */
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String username;
    private String message;
    private boolean success;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, String username, String message, boolean success) {
        this.token = token;
        this.username = username;
        this.message = message;
        this.success = success;
    }

    // Static factory methods
    public static AuthResponse success(String token, String username) {
        return new AuthResponse(token, username, "Authentication successful", true);
    }

    public static AuthResponse failure(String message) {
        return new AuthResponse(null, null, message, false);
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
