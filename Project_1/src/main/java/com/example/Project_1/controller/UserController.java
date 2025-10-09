package com.example.Project_1.controller;

import com.example.Project_1.model.ApiResponse;
import com.example.Project_1.model.User;
import com.example.Project_1.service.UserService;
import com.example.Project_1.exception.UserNotFoundException;
import com.example.Project_1.exception.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // Get user profile
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserProfile(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", user));
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get user profile: " + e.getMessage()));
        }
    }

    // Create new user
    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(ApiResponse.success("User created successfully", createdUser));
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("User already exists: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid user data: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create user: " + e.getMessage()));
        }
    }

    // Update user profile
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable String userId, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(userId, user);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid user data: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update user: " + e.getMessage()));
        }
    }

    // Delete user
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete user: " + e.getMessage()));
        }
    }

    // Get all users
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get users: " + e.getMessage()));
        }
    }

    // Get users by runner type
    @GetMapping("/type/{runnerType}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRunnerType(@PathVariable String runnerType) {
        try {
            List<User> users = userService.getUsersByRunnerType(runnerType);
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get users: " + e.getMessage()));
        }
    }

    // Get users by budget range
    @GetMapping("/budget/{maxBudget}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByBudgetRange(@PathVariable float maxBudget) {
        try {
            List<User> users = userService.getUsersByBudgetRange(maxBudget);
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get users: " + e.getMessage()));
        }
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("User service is running"));
    }
}
