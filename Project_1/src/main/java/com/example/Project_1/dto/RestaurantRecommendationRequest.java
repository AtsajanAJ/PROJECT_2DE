package com.example.Project_1.dto;

import java.util.List;

public class RestaurantRecommendationRequest {
    private String userId;
    private String runnerType;
    private float maxBudget;
    private List<String> preferredCuisines;
    private List<String> preferredRestaurantTypes;
    private NutritionPreference preRunNutrition;
    private NutritionPreference postRunNutrition;

    // Constructors
    public RestaurantRecommendationRequest() {}

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRunnerType() { return runnerType; }
    public void setRunnerType(String runnerType) { this.runnerType = runnerType; }

    public float getMaxBudget() { return maxBudget; }
    public void setMaxBudget(float maxBudget) { this.maxBudget = maxBudget; }

    public List<String> getPreferredCuisines() { return preferredCuisines; }
    public void setPreferredCuisines(List<String> preferredCuisines) { this.preferredCuisines = preferredCuisines; }

    public List<String> getPreferredRestaurantTypes() { return preferredRestaurantTypes; }
    public void setPreferredRestaurantTypes(List<String> preferredRestaurantTypes) { this.preferredRestaurantTypes = preferredRestaurantTypes; }

    public NutritionPreference getPreRunNutrition() { return preRunNutrition; }
    public void setPreRunNutrition(NutritionPreference preRunNutrition) { this.preRunNutrition = preRunNutrition; }

    public NutritionPreference getPostRunNutrition() { return postRunNutrition; }
    public void setPostRunNutrition(NutritionPreference postRunNutrition) { this.postRunNutrition = postRunNutrition; }

    // Inner class for nutrition preferences
    public static class NutritionPreference {
        private String carbLevel;
        private String fatLevel;
        private String proteinLevel;

        public NutritionPreference() {}

        public NutritionPreference(String carbLevel, String fatLevel, String proteinLevel) {
            this.carbLevel = carbLevel;
            this.fatLevel = fatLevel;
            this.proteinLevel = proteinLevel;
        }

        // Getters and Setters
        public String getCarbLevel() { return carbLevel; }
        public void setCarbLevel(String carbLevel) { this.carbLevel = carbLevel; }

        public String getFatLevel() { return fatLevel; }
        public void setFatLevel(String fatLevel) { this.fatLevel = fatLevel; }

        public String getProteinLevel() { return proteinLevel; }
        public void setProteinLevel(String proteinLevel) { this.proteinLevel = proteinLevel; }
    }
}
