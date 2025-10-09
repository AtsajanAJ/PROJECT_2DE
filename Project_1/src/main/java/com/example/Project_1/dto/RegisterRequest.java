package com.example.Project_1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for user registration request
 */
public class RegisterRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Runner type is required")
    private String runnerType;
    
    private float budgetInterest = 500.0f;

    // Constructors
    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String email, String runnerType, float budgetInterest) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.runnerType = runnerType;
        this.budgetInterest = budgetInterest;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRunnerType() {
        return runnerType;
    }

    public void setRunnerType(String runnerType) {
        this.runnerType = runnerType;
    }

    public float getBudgetInterest() {
        return budgetInterest;
    }

    public void setBudgetInterest(float budgetInterest) {
        this.budgetInterest = budgetInterest;
    }
}
