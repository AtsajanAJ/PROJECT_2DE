package com.example.Project_1.controller;

import com.example.Project_1.service.RestaurantService;
import com.example.Project_1.model.ApiResponse;
import com.example.Project_1.model.Restaurant;
import com.example.Project_1.dto.RestaurantRecommendationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    // Endpoint to create a static user for testing
    @GetMapping("/createStaticUser")
    public ResponseEntity<ApiResponse<String>> createStaticUser() {
        try {
            System.out.println("Creating Static User...");
            restaurantService.createStaticUserForTest();
            return ResponseEntity.ok(ApiResponse.success("Static User has been created for testing!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create static user: " + e.getMessage()));
        }
    }

    // Endpoint to retrieve restaurant data and provide recommendations (legacy)
    @GetMapping("/retrieveRestaurants")
    public ResponseEntity<ApiResponse<String>> retrieveRestaurants() {
        try {
            System.out.println("Retrieving Restaurant Recommendations...");
            restaurantService.retrieveRestaurantRecommendationsForUser();
            return ResponseEntity.ok(ApiResponse.success("Restaurant recommendations have been retrieved!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("An error occurred while retrieving restaurant recommendations: " + e.getMessage()));
        }
    }

    // NEW: Get restaurant recommendations based on user preferences
    @PostMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getRecommendations(@RequestBody RestaurantRecommendationRequest request) {
        try {
            System.out.println("\n" + "🎯".repeat(20));
            System.out.println("🎯 API CALL: Get Restaurant Recommendations");
            System.out.println("🎯".repeat(20));
            System.out.println("👤 User ID: " + request.getUserId());
            System.out.println("💰 Max Budget: $" + String.format("%.2f", request.getMaxBudget()));
            System.out.println("🏃‍♂️ Runner Type: " + request.getRunnerType());
            
            List<Restaurant> recommendations = restaurantService.getRestaurantRecommendations(request);
            
            if (recommendations.isEmpty()) {
                System.out.println("❌ No recommendations found for user: " + request.getUserId());
                return ResponseEntity.ok(ApiResponse.success("No restaurants found matching your criteria", recommendations));
            } else {
                System.out.println("✅ Found " + recommendations.size() + " restaurant(s) for user: " + request.getUserId());
                
                // Display API response summary
                System.out.println("\n📋 API RESPONSE SUMMARY:");
                System.out.println("  ├─ Total recommendations: " + recommendations.size());
                System.out.println("  ├─ Top recommendation: " + recommendations.get(0).getRestaurantName());
                System.out.println("  ├─ Top score: " + String.format("%.2f", recommendations.get(0).getMatchScore()));
                System.out.println("  └─ Budget range: $" + String.format("%.2f", recommendations.get(0).getBudget()) + " - $" + 
                                 String.format("%.2f", recommendations.get(recommendations.size()-1).getBudget()));
                
                return ResponseEntity.ok(ApiResponse.success("Found " + recommendations.size() + " restaurant(s) matching your criteria", recommendations));
            }
        } catch (Exception e) {
            System.err.println("❌ API ERROR: Failed to get recommendations for user: " + request.getUserId());
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get recommendations: " + e.getMessage()));
        }
    }

    // NEW: Get all restaurants (for browsing)
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Restaurant>>> getAllRestaurants() {
        try {
            System.out.println("Getting all restaurants...");
            List<Restaurant> restaurants = restaurantService.getAllRestaurants();
            
            if (restaurants.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No restaurants found in database", restaurants));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Found " + restaurants.size() + " restaurant(s)", restaurants));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get restaurants: " + e.getMessage()));
        }
    }

    // NEW: Search restaurants by criteria
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Restaurant>>> searchRestaurants(
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "0") float maxBudget) {
        try {
            System.out.println("Searching restaurants with criteria - Cuisine: " + cuisineType + ", Location: " + location + ", Max Budget: " + maxBudget);
            List<Restaurant> results = restaurantService.searchRestaurants(cuisineType, location, maxBudget);
            
            if (results.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No restaurants found matching your search criteria", results));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Found " + results.size() + " restaurant(s) matching your criteria", results));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to search restaurants: " + e.getMessage()));
        }
    }

    // NEW: Get restaurant by ID
    @GetMapping("/{restaurantId}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurantById(@PathVariable String restaurantId) {
        try {
            System.out.println("\n" + "🎯".repeat(20));
            System.out.println("🎯 API CALL: Get Restaurant By ID");
            System.out.println("🎯".repeat(20));
            System.out.println("🔍 Restaurant ID: " + restaurantId);
            
            // Validate input
            if (restaurantId == null || restaurantId.trim().isEmpty()) {
                System.err.println("❌ Invalid restaurant ID: null or empty");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Restaurant ID cannot be null or empty"));
            }
            
            Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
            
            if (restaurant == null) {
                System.out.println("❌ Restaurant not found for ID: " + restaurantId);
                return ResponseEntity.status(404)
                    .body(ApiResponse.error("Restaurant not found with ID: " + restaurantId));
            } else {
                System.out.println("✅ Restaurant found: " + restaurant.getRestaurantName());
                
                // Display API response summary
                System.out.println("\n📋 API RESPONSE SUMMARY:");
                System.out.println("  ├─ Restaurant Name: " + restaurant.getRestaurantName());
                System.out.println("  ├─ Cuisine: " + restaurant.getCuisineType());
                System.out.println("  ├─ Type: " + restaurant.getRestaurantType());
                System.out.println("  ├─ Budget: $" + String.format("%.2f", restaurant.getBudget()));
                System.out.println("  └─ Location: " + restaurant.getLocation());
                
                return ResponseEntity.ok(ApiResponse.success("Restaurant details retrieved successfully", restaurant));
            }
        } catch (Exception e) {
            System.err.println("❌ API ERROR: Failed to get restaurant by ID: " + restaurantId);
            System.err.println("Error: " + e.getMessage());
            System.err.println("Stack trace:");
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to get restaurant: " + e.getMessage()));
        }
    }

    // NEW: Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Restaurant service is running"));
    }
}
