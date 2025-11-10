package com.example.Project_1.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id
    @Column(name = "restaurant_id")
    private String restaurantId;
    
    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;
    
    @Column(name = "cuisine_type")
    private String cuisineType;
    
    @Column(name = "restaurant_type")
    private String restaurantType;
    
    @Column(name = "location")
    private String location;

    // เพิ่ม fields ใหม่
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;
    
    @Column(name = "nationality")
    private String nationality;
    
    @Column(name = "budget", nullable = false)
    private float budget;
    
    @Column(name = "telephone")
    private String telephone;
    
    @Embedded
    private NutritionProfile nutritionProfile;
    
    @Column(name = "match_score")
    private float matchScore;

    @Transient
    private Float ruleConfidence;

    @Transient
    private java.util.List<String> matchedRules;

    // Constructors
    public Restaurant() {}

    public Restaurant(String restaurantId, String restaurantName, String cuisineType, float budget) {
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.cuisineType = cuisineType;
        this.budget = budget;
    }

    // Getters and Setters
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }

    public String getRestaurantType() { return restaurantType; }
    public void setRestaurantType(String restaurantType) { this.restaurantType = restaurantType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public float getBudget() { return budget; }
    public void setBudget(float budget) { this.budget = budget; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public NutritionProfile getNutritionProfile() { return nutritionProfile; }
    public void setNutritionProfile(NutritionProfile nutritionProfile) { this.nutritionProfile = nutritionProfile; }

    public float getMatchScore() { return matchScore; }
    public void setMatchScore(float matchScore) { this.matchScore = matchScore; }

    public Float getRuleConfidence() { return ruleConfidence; }
    public void setRuleConfidence(Float ruleConfidence) { this.ruleConfidence = ruleConfidence; }

    public java.util.List<String> getMatchedRules() { return matchedRules; }
    public void setMatchedRules(java.util.List<String> matchedRules) { this.matchedRules = matchedRules; }

    // Inner class for nutrition profile
    @Embeddable
    public static class NutritionProfile {
        @Column(name = "carb_level")
        private String carbLevel;
        
        @Column(name = "fat_level")
        private String fatLevel;
        
        @Column(name = "protein_level")
        private String proteinLevel;

        public NutritionProfile() {}

        public NutritionProfile(String carbLevel, String fatLevel, String proteinLevel) {
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
