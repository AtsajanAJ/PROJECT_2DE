package com.example.Project_1.util;

import com.example.Project_1.dto.RestaurantRecommendationRequest;
import com.example.Project_1.model.User;
import com.example.Project_1.model.Restaurant;

import java.util.List;

public class ValidationUtil {

    public static boolean isValidUserId(String userId) {
        return userId != null && !userId.trim().isEmpty() && userId.length() <= 50;
    }

    public static boolean isValidRunnerType(String runnerType) {
        if (runnerType == null || runnerType.trim().isEmpty()) {
            return false;
        }
        
        String[] validTypes = {"Sprint", "Middle Distance", "Long Distance", "Marathon", "Ultra Marathon"};
        for (String type : validTypes) {
            if (type.equalsIgnoreCase(runnerType.trim())) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidBudget(float budget) {
        return budget >= 0 && budget <= 10000; // Max 10,000 baht
    }

    public static boolean isValidNutritionLevel(String level) {
        if (level == null || level.trim().isEmpty()) {
            return false;
        }
        
        String[] validLevels = {"Low", "Medium", "High"};
        for (String validLevel : validLevels) {
            if (validLevel.equalsIgnoreCase(level.trim())) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidCuisineType(String cuisineType) {
        if (cuisineType == null || cuisineType.trim().isEmpty()) {
            return false;
        }
        
        String[] validCuisines = {
            "Thai", "Japanese", "Chinese", "Italian", "Mexican", "Indian", 
            "Korean", "Vietnamese", "American", "French", "Mediterranean"
        };
        
        for (String cuisine : validCuisines) {
            if (cuisine.equalsIgnoreCase(cuisineType.trim())) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidRestaurantType(String restaurantType) {
        if (restaurantType == null || restaurantType.trim().isEmpty()) {
            return false;
        }
        
        String[] validTypes = {
            "Fast Food", "Fast Dining", "Casual Dining", "Fine Dining", 
            "Buffet", "Street Food", "Cafe", "Bakery"
        };
        
        for (String type : validTypes) {
            if (type.equalsIgnoreCase(restaurantType.trim())) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidLocation(String location) {
        return location != null && !location.trim().isEmpty() && location.length() <= 100;
    }

    public static boolean isValidRestaurantName(String name) {
        return name != null && !name.trim().isEmpty() && name.length() <= 100;
    }

    public static boolean isValidTelephone(String telephone) {
        if (telephone == null || telephone.trim().isEmpty()) {
            return false;
        }
        
        // Basic phone number validation for Thailand
        String phoneRegex = "^(\\+66|0)[0-9]{8,9}$";
        return telephone.trim().matches(phoneRegex);
    }

    public static boolean isValidUser(User user) {
        if (user == null) {
            return false;
        }
        
        return isValidUserId(user.getUserId()) &&
               isValidRunnerType(user.getRunnerType()) &&
               isValidBudget(user.getBudgetInterest()) &&
               (user.getPreRunCarbConsumption() == null || isValidNutritionLevel(user.getPreRunCarbConsumption())) &&
               (user.getPreRunFatConsumption() == null || isValidNutritionLevel(user.getPreRunFatConsumption())) &&
               (user.getPreRunProteinConsumption() == null || isValidNutritionLevel(user.getPreRunProteinConsumption())) &&
               (user.getPostRunCarbConsumption() == null || isValidNutritionLevel(user.getPostRunCarbConsumption())) &&
               (user.getPostRunFatConsumption() == null || isValidNutritionLevel(user.getPostRunFatConsumption())) &&
               (user.getPostRunProteinConsumption() == null || isValidNutritionLevel(user.getPostRunProteinConsumption()));
    }

    public static boolean isValidRestaurant(Restaurant restaurant) {
        if (restaurant == null) {
            return false;
        }
        
        return isValidRestaurantName(restaurant.getRestaurantName()) &&
               isValidBudget(restaurant.getBudget()) &&
               (restaurant.getCuisineType() == null || isValidCuisineType(restaurant.getCuisineType())) &&
               (restaurant.getRestaurantType() == null || isValidRestaurantType(restaurant.getRestaurantType())) &&
               (restaurant.getLocation() == null || isValidLocation(restaurant.getLocation())) &&
               (restaurant.getTelephone() == null || isValidTelephone(restaurant.getTelephone()));
    }

    public static boolean isValidRecommendationRequest(RestaurantRecommendationRequest request) {
        if (request == null) {
            return false;
        }
        
        return isValidUserId(request.getUserId()) &&
               isValidRunnerType(request.getRunnerType()) &&
               isValidBudget(request.getMaxBudget()) &&
               (request.getPreferredCuisines() == null || request.getPreferredCuisines().isEmpty() || 
                request.getPreferredCuisines().stream().allMatch(ValidationUtil::isValidCuisineType)) &&
               (request.getPreferredRestaurantTypes() == null || request.getPreferredRestaurantTypes().isEmpty() || 
                request.getPreferredRestaurantTypes().stream().allMatch(ValidationUtil::isValidRestaurantType));
    }

    public static String sanitizeString(String input) {
        if (input == null) {
            return null;
        }
        
        return input.trim()
                   .replaceAll("<script[^>]*>.*?</script>", "") // Remove script tags
                   .replaceAll("<[^>]*>", "") // Remove HTML tags
                   .replaceAll("['\";]", ""); // Remove dangerous characters
    }

    public static List<String> sanitizeStringList(List<String> inputList) {
        if (inputList == null) {
            return null;
        }
        
        return inputList.stream()
                       .map(ValidationUtil::sanitizeString)
                       .filter(s -> s != null && !s.isEmpty())
                       .toList();
    }
}
