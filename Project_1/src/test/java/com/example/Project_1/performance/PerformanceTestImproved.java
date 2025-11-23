package com.example.Project_1.performance;

import com.example.Project_1.dto.RestaurantRecommendationRequest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

/**
 * Performance Testing - Improved Version
 * Uses optimized implementations with caching for better performance
 */
@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PerformanceTestImproved extends PerformanceTestInitial {
    
    @BeforeAll
    static void setUp() {
        System.out.println("=".repeat(80));
        System.out.println("PERFORMANCE TESTING - IMPROVED VERSION (WITH CACHING)");
        System.out.println("=".repeat(80));
    }
    
    // Override test methods to use improved/optimized service methods
    
    @Override
    protected void testRemoveMethod() {
        RestaurantRecommendationRequest request = createTestRequest();
        restaurantService.getRestaurantRecommendationsRemoveImproved(request);
    }

    @Override
    protected void testReplaceMethod() {
        RestaurantRecommendationRequest request = createTestRequest();
        restaurantService.getRestaurantRecommendationsReplaceImproved(request);
    }

    @Override
    protected void testReloadMethod() {
        RestaurantRecommendationRequest request = createTestRequest();
        restaurantService.getRestaurantRecommendationsReloadImproved(request);
    }

    @Override
    protected void testRemoveMethodWithRunnerType(String runnerType) {
        RestaurantRecommendationRequest request = createTestRequest();
        request.setRunnerType(runnerType);
        restaurantService.getRestaurantRecommendationsRemoveImproved(request);
    }

    @Override
    protected void testRemoveMethodWithBudget(float budget) {
        RestaurantRecommendationRequest request = createTestRequest();
        request.setMaxBudget(budget);
        restaurantService.getRestaurantRecommendationsRemoveImproved(request);
    }
    
    @AfterAll
    static void generateReport() {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("RECORDING RESULTS...");
        System.out.println("=".repeat(80));
        
        // Record to CSV (uses testResults from parent class)
        TestResultRecorder.recordPerformanceTest("improved", testResults);
        
        // Generate summary
        TestResultRecorder.generateSummaryReport("improved", testResults);
        
        System.out.println("=".repeat(80));
        System.out.println("PERFORMANCE TESTING (IMPROVED) COMPLETED");
        System.out.println("Results saved to: test-results/performance_test_improved_*.csv");
        System.out.println("=".repeat(80));
    }
}


