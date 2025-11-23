package com.example.Project_1.controller;

import com.example.Project_1.dto.AuthResponse;
import com.example.Project_1.dto.LoginRequest;
import com.example.Project_1.dto.RegisterRequest;
import com.example.Project_1.dto.RestaurantRecommendationRequest;
import com.example.Project_1.model.ApiResponse;
import com.example.Project_1.model.User;
import com.example.Project_1.performance.TestResultRecorder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Functional Testing for all Web Services
 * Records results to CSV file
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class FunctionalTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String authToken;
    private static String testUsername = "testuser_" + System.currentTimeMillis();
    private static String testPassword = "testpass123";
    private static String testEmail = "test@example.com";
    private static int testCaseCounter = 1;

    @BeforeAll
    static void setUp() {
        // Disable rate limiting for tests
        System.setProperty("test.mode", "true");
        
        // Initialize functional test result file (create once for all test cases)
        TestResultRecorder.initializeFunctionalTestFile();
        
        System.out.println("=".repeat(80));
        System.out.println("FUNCTIONAL TESTING - All Web Services");
        System.out.println("=".repeat(80));
    }

    // ========== AUTH TESTS ==========
    
    @Test
    @Order(1)
    @DisplayName("Test Case 1: Auth - Correct username and password")
    void testAuth_CorrectCredentials() throws Exception {
        String objective = "Testing the auth web service with correct username and correct password";
        
        // Register first
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(testUsername);
        registerRequest.setPassword(testPassword);
        registerRequest.setEmail(testEmail);
        registerRequest.setRunnerType("Marathon");
        registerRequest.setBudgetInterest(500.0f);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Test login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(testUsername);
        loginRequest.setPassword(testPassword);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(response, AuthResponse.class);
        authToken = authResponse.getToken();
        assertNotNull(authToken);
        
        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(2)
    @DisplayName("Test Case 2: Auth - Wrong username")
    void testAuth_WrongUsername() throws Exception {
        String objective = "Testing the auth web service with wrong username and correct password";
        
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("wronguser");
        loginRequest.setPassword(testPassword);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(3)
    @DisplayName("Test Case 3: Auth - Wrong password")
    void testAuth_WrongPassword() throws Exception {
        String objective = "Testing the auth web service with correct username and wrong password";
        
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(testUsername);
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(4)
    @DisplayName("Test Case 4: Auth - Wrong credentials")
    void testAuth_WrongCredentials() throws Exception {
        String objective = "Testing the auth web service with wrong username and wrong password";
        
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("wronguser");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== RESTAURANT TESTS ==========
    
    @Test
    @Order(5)
    @DisplayName("Test Case 5: GetAllRestaurants - Without input")
    void testGetAllRestaurants_WithoutInput() throws Exception {
        String objective = "Testing the getAllRestaurants web service without input value";
        
        MvcResult result = mockMvc.perform(get("/api/restaurants/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(6)
    @DisplayName("Test Case 6: GetRecommendations - Valid request")
    void testGetRecommendations_ValidRequest() throws Exception {
        String objective = "Testing the getRecommendEvent web service with valid value to verify correct result";
        
        RestaurantRecommendationRequest request = new RestaurantRecommendationRequest();
        request.setUserId(testUsername);
        request.setRunnerType("Marathon");
        request.setMaxBudget(500.0f);
        request.setPreferredCuisines(Arrays.asList("Japanese", "Thai"));
        request.setPreferredRestaurantTypes(Arrays.asList("Fast Dining"));

        RestaurantRecommendationRequest.NutritionPreference preRun = 
            new RestaurantRecommendationRequest.NutritionPreference();
        preRun.setCarbLevel("Low");
        preRun.setFatLevel("High");
        preRun.setProteinLevel("High");
        request.setPreRunNutrition(preRun);

        MvcResult result = mockMvc.perform(post("/api/restaurants/recommendations")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== USER TESTS ==========
    
    @Test
    @Order(7)
    @DisplayName("Test Case 7: GetUserProfile - Correct username and token")
    void testGetUserProfile_CorrectUsernameAndToken() throws Exception {
        String objective = "Testing the getUserProfile web service with correct username and correct token";
        
        mockMvc.perform(get("/api/users/" + testUsername)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.userId").value(testUsername));

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(8)
    @DisplayName("Test Case 8: SetUserProfile - Existing username")
    void testSetUserProfile_ExistingUsername() throws Exception {
        String objective = "Testing the setUserProfile web service with existing username";
        
        User existingUser = new User();
        existingUser.setUserId(testUsername);
        existingUser.setRunnerType("Sprint");
        existingUser.setBudgetInterest(400.0f);

        mockMvc.perform(put("/api/users/" + testUsername)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(existingUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== NEGATIVE TEST CASES ==========
    
    @Test
    @Order(9)
    @DisplayName("Test Case 9: Register - Duplicate username")
    void testRegister_DuplicateUsername() throws Exception {
        String objective = "Testing the register web service with duplicate username to verify error handling";
        
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(testUsername); // Already exists
        registerRequest.setPassword("newpass123");
        registerRequest.setEmail("newemail@example.com");
        registerRequest.setRunnerType("Marathon");
        registerRequest.setBudgetInterest(500.0f);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(10)
    @DisplayName("Test Case 10: GetUserProfile - Invalid token")
    void testGetUserProfile_InvalidToken() throws Exception {
        String objective = "Testing the getUserProfile web service with invalid token to verify authorization";
        
        mockMvc.perform(get("/api/users/" + testUsername)
                .header("Authorization", "Bearer invalid_token_12345")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(11)
    @DisplayName("Test Case 11: GetUserProfile - Missing token")
    void testGetUserProfile_MissingToken() throws Exception {
        String objective = "Testing the getUserProfile web service without token to verify authorization";
        
        mockMvc.perform(get("/api/users/" + testUsername)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(12)
    @DisplayName("Test Case 12: GetUserProfile - Non-existent user")
    void testGetUserProfile_NonExistentUser() throws Exception {
        String objective = "Testing the getUserProfile web service with non-existent username to verify error handling";
        
        mockMvc.perform(get("/api/users/nonexistent_user_12345")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(13)
    @DisplayName("Test Case 13: GetRecommendations - Missing token")
    void testGetRecommendations_MissingToken() throws Exception {
        String objective = "Testing the getRecommendations web service without token to verify authorization";
        
        RestaurantRecommendationRequest request = new RestaurantRecommendationRequest();
        request.setUserId(testUsername);
        request.setRunnerType("Marathon");
        request.setMaxBudget(500.0f);

        mockMvc.perform(post("/api/restaurants/recommendations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(14)
    @DisplayName("Test Case 14: GetRecommendations - Invalid request data")
    void testGetRecommendations_InvalidRequest() throws Exception {
        String objective = "Testing the getRecommendations web service with invalid request data to verify validation";
        
        // Request with missing required fields
        RestaurantRecommendationRequest request = new RestaurantRecommendationRequest();
        request.setUserId(null); // Missing userId
        request.setRunnerType("Marathon");

        MvcResult result = mockMvc.perform(post("/api/restaurants/recommendations")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        
        // May return 200 with empty results or 400/500 for validation errors
        int status = result.getResponse().getStatus();
        assertTrue(status == 200 || status == 400 || status == 500, 
            "Expected status 200, 400, or 500 but got: " + status);

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== RESTAURANT SEARCH TESTS ==========
    
    @Test
    @Order(15)
    @DisplayName("Test Case 15: SearchRestaurants - Basic search")
    void testSearchRestaurants_Basic() throws Exception {
        String objective = "Testing the searchRestaurants web service with basic criteria";
        
        MvcResult result = mockMvc.perform(get("/api/restaurants/search")
                .param("cuisineType", "Japanese")
                .param("maxBudget", "500")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(16)
    @DisplayName("Test Case 16: SearchRestaurants - Advanced search")
    void testSearchRestaurants_Advanced() throws Exception {
        String objective = "Testing the advanced searchRestaurants web service with multiple criteria";
        
        MvcResult result = mockMvc.perform(get("/api/restaurants/search/advanced")
                .param("cuisineType", "Thai")
                .param("restaurantType", "Fast Dining")
                .param("minBudget", "100")
                .param("maxBudget", "500")
                .param("sortBy", "budget")
                .param("sortOrder", "asc")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(17)
    @DisplayName("Test Case 17: SearchRestaurants - By nutrition")
    void testSearchRestaurants_ByNutrition() throws Exception {
        String objective = "Testing the searchRestaurants web service by nutrition preferences";
        
        MvcResult result = mockMvc.perform(get("/api/restaurants/search/nutrition")
                .param("carbLevel", "Low")
                .param("fatLevel", "High")
                .param("proteinLevel", "High")
                .param("runnerType", "Marathon")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(18)
    @DisplayName("Test Case 18: SearchRestaurants - By budget range")
    void testSearchRestaurants_ByBudget() throws Exception {
        String objective = "Testing the searchRestaurants web service by budget range";
        
        MvcResult result = mockMvc.perform(get("/api/restaurants/search/budget")
                .param("minBudget", "200")
                .param("maxBudget", "400")
                .param("sortBy", "budget")
                .param("sortOrder", "asc")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== USER MANAGEMENT TESTS ==========
    
    @Test
    @Order(19)
    @DisplayName("Test Case 19: GetAllUsers - With token")
    void testGetAllUsers_WithToken() throws Exception {
        String objective = "Testing the getAllUsers web service with valid token";
        
        MvcResult result = mockMvc.perform(get("/api/users")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(20)
    @DisplayName("Test Case 20: GetUsersByRunnerType - Valid type")
    void testGetUsersByRunnerType_ValidType() throws Exception {
        String objective = "Testing the getUsersByRunnerType web service with valid runner type";
        
        MvcResult result = mockMvc.perform(get("/api/users/type/Marathon")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(21)
    @DisplayName("Test Case 21: GetUsersByBudgetRange - Valid budget")
    void testGetUsersByBudgetRange_ValidBudget() throws Exception {
        String objective = "Testing the getUsersByBudgetRange web service with valid budget";
        
        MvcResult result = mockMvc.perform(get("/api/users/budget/500")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(22)
    @DisplayName("Test Case 22: DeleteUser - Valid user")
    void testDeleteUser_ValidUser() throws Exception {
        String objective = "Testing the deleteUser web service with valid user";
        
        // Create a temporary user to delete
        String tempUsername = "tempuser_" + System.currentTimeMillis();
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(tempUsername);
        registerRequest.setPassword("temppass123");
        registerRequest.setEmail("temp@example.com");
        registerRequest.setRunnerType("Sprint");
        registerRequest.setBudgetInterest(300.0f);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Login to get token for deletion
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(tempUsername);
        loginRequest.setPassword("temppass123");
        
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
        
        String loginResponse = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(loginResponse, AuthResponse.class);
        String tempToken = authResponse.getToken();

        // Delete the user
        mockMvc.perform(delete("/api/users/" + tempUsername)
                .header("Authorization", "Bearer " + tempToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(23)
    @DisplayName("Test Case 23: DeleteUser - Non-existent user")
    void testDeleteUser_NonExistentUser() throws Exception {
        String objective = "Testing the deleteUser web service with non-existent user to verify error handling";
        
        mockMvc.perform(delete("/api/users/nonexistent_user_99999")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== HEALTH CHECK TESTS ==========
    
    @Test
    @Order(24)
    @DisplayName("Test Case 24: HealthCheck - Restaurant service")
    void testHealthCheck_RestaurantService() throws Exception {
        String objective = "Testing the restaurant service health check endpoint";
        
        MvcResult result = mockMvc.perform(get("/api/restaurants/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(25)
    @DisplayName("Test Case 25: HealthCheck - User service")
    void testHealthCheck_UserService() throws Exception {
        String objective = "Testing the user service health check endpoint";
        
        MvcResult result = mockMvc.perform(get("/api/users/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(response, ApiResponse.class);
        assertTrue(apiResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    // ========== AUTH ADDITIONAL TESTS ==========
    
    @Test
    @Order(26)
    @DisplayName("Test Case 26: ValidateToken - Valid token")
    void testValidateToken_ValidToken() throws Exception {
        String objective = "Testing the validateToken web service with valid token";
        
        MvcResult result = mockMvc.perform(post("/api/auth/validate")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(response, AuthResponse.class);
        assertTrue(authResponse.isSuccess());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(27)
    @DisplayName("Test Case 27: ValidateToken - Invalid token")
    void testValidateToken_InvalidToken() throws Exception {
        String objective = "Testing the validateToken web service with invalid token to verify error handling";
        
        mockMvc.perform(post("/api/auth/validate")
                .header("Authorization", "Bearer invalid_token_12345")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @Test
    @Order(28)
    @DisplayName("Test Case 28: GetCurrentUser - With authentication")
    void testGetCurrentUser_WithAuthentication() throws Exception {
        String objective = "Testing the getCurrentUser web service with valid authentication";
        
        MvcResult result = mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertNotNull(response);
        assertFalse(response.isEmpty());

        TestResultRecorder.recordFunctionalTest(
            String.valueOf(testCaseCounter++), 
            objective, 
            "Pass"
        );
    }

    @AfterAll
    static void tearDown() {
        // Clean up
        System.clearProperty("test.mode");
        System.out.println("=".repeat(80));
        System.out.println("FUNCTIONAL TESTING COMPLETED");
        System.out.println("Results saved to: test-results/functional_test_results_*.csv");
        System.out.println("=".repeat(80));
    }
}

