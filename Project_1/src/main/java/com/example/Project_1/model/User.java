package com.example.Project_1.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "runner_type", nullable = false)
    private String runnerType;
    
    @Column(name = "budget_interest", nullable = false)
    private float budgetInterest;
    
    @Column(name = "pre_run_carb_consumption")
    private String preRunCarbConsumption;
    
    @Column(name = "pre_run_fat_consumption")
    private String preRunFatConsumption;
    
    @Column(name = "pre_run_protein_consumption")
    private String preRunProteinConsumption;
    
    @Column(name = "post_run_carb_consumption")
    private String postRunCarbConsumption;
    
    @Column(name = "post_run_fat_consumption")
    private String postRunFatConsumption;
    
    @Column(name = "post_run_protein_consumption")
    private String postRunProteinConsumption;
    
    @ElementCollection
    @CollectionTable(name = "user_food_type_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "food_type")
    private List<String> foodTypeInterests;
    
    @ElementCollection
    @CollectionTable(name = "user_restaurant_type_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "restaurant_type")
    private List<String> restaurantTypeInterests;

    // Constructors
    public User() {}

    public User(String userId, String password, String email, String runnerType, float budgetInterest) {
        this.userId = userId;
        this.password = password;
        this.email = email;
        this.runnerType = runnerType;
        this.budgetInterest = budgetInterest;
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRunnerType() { return runnerType; }
    public void setRunnerType(String runnerType) { this.runnerType = runnerType; }

    public float getBudgetInterest() { return budgetInterest; }
    public void setBudgetInterest(float budgetInterest) { this.budgetInterest = budgetInterest; }

    public String getPreRunCarbConsumption() { return preRunCarbConsumption; }
    public void setPreRunCarbConsumption(String preRunCarbConsumption) { this.preRunCarbConsumption = preRunCarbConsumption; }

    public String getPreRunFatConsumption() { return preRunFatConsumption; }
    public void setPreRunFatConsumption(String preRunFatConsumption) { this.preRunFatConsumption = preRunFatConsumption; }

    public String getPreRunProteinConsumption() { return preRunProteinConsumption; }
    public void setPreRunProteinConsumption(String preRunProteinConsumption) { this.preRunProteinConsumption = preRunProteinConsumption; }

    public String getPostRunCarbConsumption() { return postRunCarbConsumption; }
    public void setPostRunCarbConsumption(String postRunCarbConsumption) { this.postRunCarbConsumption = postRunCarbConsumption; }

    public String getPostRunFatConsumption() { return postRunFatConsumption; }
    public void setPostRunFatConsumption(String postRunFatConsumption) { this.postRunFatConsumption = postRunFatConsumption; }

    public String getPostRunProteinConsumption() { return postRunProteinConsumption; }
    public void setPostRunProteinConsumption(String postRunProteinConsumption) { this.postRunProteinConsumption = postRunProteinConsumption; }

    public List<String> getFoodTypeInterests() { return foodTypeInterests; }
    public void setFoodTypeInterests(List<String> foodTypeInterests) { this.foodTypeInterests = foodTypeInterests; }

    public List<String> getRestaurantTypeInterests() { return restaurantTypeInterests; }
    public void setRestaurantTypeInterests(List<String> restaurantTypeInterests) { this.restaurantTypeInterests = restaurantTypeInterests; }
}
