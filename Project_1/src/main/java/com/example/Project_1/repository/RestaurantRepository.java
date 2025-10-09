package com.example.Project_1.repository;

import com.example.Project_1.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
    
    List<Restaurant> findByCuisineType(String cuisineType);
    
    List<Restaurant> findByRestaurantType(String restaurantType);
    
    List<Restaurant> findByLocation(String location);
    
    List<Restaurant> findByBudgetLessThanEqual(float maxBudget);
    
    @Query("SELECT r FROM Restaurant r WHERE r.cuisineType = :cuisineType AND r.budget <= :maxBudget")
    List<Restaurant> findByCuisineTypeAndBudget(@Param("cuisineType") String cuisineType, @Param("maxBudget") float maxBudget);
    
    @Query("SELECT r FROM Restaurant r WHERE r.cuisineType LIKE %:cuisineType% OR r.restaurantName LIKE %:searchTerm% OR r.location LIKE %:searchTerm%")
    List<Restaurant> searchRestaurants(@Param("cuisineType") String cuisineType, @Param("searchTerm") String searchTerm);
    
    List<Restaurant> findByCuisineTypeInAndBudgetLessThanEqual(List<String> cuisineTypes, float maxBudget);
}
