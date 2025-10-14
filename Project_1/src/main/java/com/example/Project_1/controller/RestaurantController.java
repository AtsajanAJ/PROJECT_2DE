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

    // ENHANCED: Advanced search restaurants with multiple criteria
    @GetMapping("/search/advanced")
    public ResponseEntity<ApiResponse<List<Restaurant>>> searchRestaurantsAdvanced(
            @RequestParam(required = false) String restaurantName,
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false) String restaurantType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String nationality,
            @RequestParam(required = false, defaultValue = "0") float minBudget,
            @RequestParam(required = false, defaultValue = "0") float maxBudget,
            @RequestParam(required = false) String carbLevel,
            @RequestParam(required = false) String fatLevel,
            @RequestParam(required = false) String proteinLevel,
            @RequestParam(required = false) String runnerType,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {
        try {
            System.out.println("\n" + "🎯".repeat(20));
            System.out.println("🎯 API CALL: Advanced Restaurant Search");
            System.out.println("🎯".repeat(20));
            System.out.println("📋 Search Parameters:");
            System.out.println("  ├─ Restaurant Name: " + (restaurantName != null ? restaurantName : "Any"));
            System.out.println("  ├─ Cuisine Type: " + (cuisineType != null ? cuisineType : "Any"));
            System.out.println("  ├─ Restaurant Type: " + (restaurantType != null ? restaurantType : "Any"));
            System.out.println("  ├─ Location: " + (location != null ? location : "Any"));
            System.out.println("  ├─ Nationality: " + (nationality != null ? nationality : "Any"));
            System.out.println("  ├─ Budget Range: $" + String.format("%.2f", minBudget) + " - $" + String.format("%.2f", maxBudget));
            System.out.println("  ├─ Nutrition: Carb=" + (carbLevel != null ? carbLevel : "Any") + 
                             ", Fat=" + (fatLevel != null ? fatLevel : "Any") + 
                             ", Protein=" + (proteinLevel != null ? proteinLevel : "Any"));
            System.out.println("  ├─ Runner Type: " + (runnerType != null ? runnerType : "Any"));
            System.out.println("  ├─ Sort By: " + sortBy);
            System.out.println("  └─ Sort Order: " + sortOrder);
            
            List<Restaurant> results = restaurantService.searchRestaurantsAdvanced(
                restaurantName, cuisineType, restaurantType, location, nationality,
                minBudget, maxBudget, carbLevel, fatLevel, proteinLevel, runnerType,
                sortBy, sortOrder);
            
            if (results.isEmpty()) {
                System.out.println("❌ No restaurants found matching advanced search criteria");
                return ResponseEntity.ok(ApiResponse.success("No restaurants found matching your advanced search criteria", results));
            } else {
                System.out.println("✅ Found " + results.size() + " restaurant(s) matching advanced search criteria");
                
                // Display API response summary
                System.out.println("\n📋 ADVANCED SEARCH API RESPONSE SUMMARY:");
                System.out.println("  ├─ Total results: " + results.size());
                System.out.println("  ├─ First result: " + results.get(0).getRestaurantName());
                System.out.println("  ├─ Last result: " + results.get(results.size()-1).getRestaurantName());
                System.out.println("  ├─ Budget range: $" + String.format("%.2f", results.get(0).getBudget()) + " - $" + 
                                 String.format("%.2f", results.get(results.size()-1).getBudget()));
                System.out.println("  └─ Sort: " + sortBy + " (" + sortOrder + ")");
                
                return ResponseEntity.ok(ApiResponse.success("Found " + results.size() + " restaurant(s) matching your advanced search criteria", results));
            }
        } catch (Exception e) {
            System.err.println("❌ API ERROR: Failed to perform advanced search");
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to perform advanced search: " + e.getMessage()));
        }
    }

    // ENHANCED: Search restaurants by nutrition preferences
    @GetMapping("/search/nutrition")
    public ResponseEntity<ApiResponse<List<Restaurant>>> searchByNutrition(
            @RequestParam(required = false) String carbLevel,
            @RequestParam(required = false) String fatLevel,
            @RequestParam(required = false) String proteinLevel,
            @RequestParam(required = false) String runnerType,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {
        try {
            System.out.println("\n" + "🥗".repeat(20));
            System.out.println("🥗 API CALL: Search by Nutrition Preferences");
            System.out.println("🥗".repeat(20));
            System.out.println("📋 Nutrition Criteria:");
            System.out.println("  ├─ Carb Level: " + (carbLevel != null ? carbLevel : "Any"));
            System.out.println("  ├─ Fat Level: " + (fatLevel != null ? fatLevel : "Any"));
            System.out.println("  ├─ Protein Level: " + (proteinLevel != null ? proteinLevel : "Any"));
            System.out.println("  ├─ Runner Type: " + (runnerType != null ? runnerType : "Any"));
            System.out.println("  ├─ Sort By: " + sortBy);
            System.out.println("  └─ Sort Order: " + sortOrder);
            
            List<Restaurant> results = restaurantService.searchRestaurantsAdvanced(
                null, null, null, null, null, 0, 0, 
                carbLevel, fatLevel, proteinLevel, runnerType, sortBy, sortOrder);
            
            if (results.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No restaurants found matching your nutrition preferences", results));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Found " + results.size() + " restaurant(s) matching your nutrition preferences", results));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to search by nutrition: " + e.getMessage()));
        }
    }

    // BASIC: Search restaurants by criteria (backward compatibility)
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

    // ENHANCED: Search restaurants by budget range
    @GetMapping("/search/budget")
    public ResponseEntity<ApiResponse<List<Restaurant>>> searchByBudget(
            @RequestParam(required = false, defaultValue = "0") float minBudget,
            @RequestParam(required = false, defaultValue = "0") float maxBudget,
            @RequestParam(required = false, defaultValue = "budget") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {
        try {
            System.out.println("\n" + "💰".repeat(20));
            System.out.println("💰 API CALL: Search by Budget Range");
            System.out.println("💰".repeat(20));
            System.out.println("📋 Budget Criteria:");
            System.out.println("  ├─ Min Budget: $" + String.format("%.2f", minBudget));
            System.out.println("  ├─ Max Budget: $" + String.format("%.2f", maxBudget));
            System.out.println("  ├─ Sort By: " + sortBy);
            System.out.println("  └─ Sort Order: " + sortOrder);
            
            List<Restaurant> results = restaurantService.searchRestaurantsAdvanced(
                null, null, null, null, null, minBudget, maxBudget, 
                null, null, null, null, sortBy, sortOrder);
            
            if (results.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("No restaurants found in your budget range", results));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Found " + results.size() + " restaurant(s) in your budget range", results));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to search by budget: " + e.getMessage()));
        }
    }
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
