package com.example.Project_1.controller;

import com.example.Project_1.dto.AuthResponse;
import com.example.Project_1.dto.LoginRequest;
import com.example.Project_1.dto.RegisterRequest;
import com.example.Project_1.model.User;
import com.example.Project_1.service.UserService;
import com.example.Project_1.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller for login and registration
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * User login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Login attempt for user: " + loginRequest.getUsername());
            
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            System.out.println("✅ Login successful for user: " + loginRequest.getUsername());
            
            return ResponseEntity.ok(AuthResponse.success(token, userDetails.getUsername()));

        } catch (BadCredentialsException e) {
            System.err.println("❌ Login failed for user: " + loginRequest.getUsername() + " - Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.failure("Invalid username or password"));
        } catch (Exception e) {
            System.err.println("❌ Login error for user: " + loginRequest.getUsername() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.failure("Login failed: " + e.getMessage()));
        }
    }

    /**
     * User registration endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("📝 Registration attempt for user: " + registerRequest.getUsername());
            
            // Check if user already exists
            if (userService.userExists(registerRequest.getUsername())) {
                System.err.println("❌ Registration failed - User already exists: " + registerRequest.getUsername());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthResponse.failure("Username already exists"));
            }

            // Create new user
            User newUser = new User();
            newUser.setUserId(registerRequest.getUsername());
            newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            newUser.setEmail(registerRequest.getEmail());
            newUser.setRunnerType(registerRequest.getRunnerType());
            newUser.setBudgetInterest(registerRequest.getBudgetInterest());

            // Save user
            User savedUser = userService.createUser(newUser);

            // Generate JWT token for immediate login
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", savedUser.getUserId());
            claims.put("email", savedUser.getEmail());
            claims.put("runnerType", savedUser.getRunnerType());
            
            String token = jwtUtil.generateToken(registerRequest.getUsername(), claims);

            System.out.println("✅ Registration successful for user: " + registerRequest.getUsername());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(AuthResponse.success(token, savedUser.getUserId()));

        } catch (Exception e) {
            System.err.println("❌ Registration error for user: " + registerRequest.getUsername() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.failure("Registration failed: " + e.getMessage()));
        }
    }

    /**
     * Validate token endpoint
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtUtil.extractTokenFromHeader(authHeader);
            
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.failure("No token provided"));
            }

            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                return ResponseEntity.ok(AuthResponse.success(token, username));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.failure("Invalid token"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.failure("Token validation failed: " + e.getMessage()));
        }
    }

    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.failure("Not authenticated"));
            }

            String username = authentication.getName();
            User user = userService.getUserById(username);
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("username", user.getUserId());
            userInfo.put("email", user.getEmail());
            userInfo.put("runnerType", user.getRunnerType());
            userInfo.put("budgetInterest", user.getBudgetInterest());
            userInfo.put("authorities", authentication.getAuthorities());

            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.failure("Failed to get user info: " + e.getMessage()));
        }
    }
}
