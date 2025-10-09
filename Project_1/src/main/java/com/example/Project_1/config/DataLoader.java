// package com.example.Project_1.config;

// import com.example.Project_1.model.User;
// import com.example.Project_1.model.Restaurant;
// import com.example.Project_1.repository.UserRepository;
// import com.example.Project_1.repository.RestaurantRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import java.util.Arrays;
// import java.util.List;

// @Component
// public class DataLoader implements CommandLineRunner {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private RestaurantRepository restaurantRepository;

//     @Override
//     public void run(String... args) throws Exception {
//         // Load sample users
//         loadSampleUsers();
        
//         // Load sample restaurants
//         loadSampleRestaurants();
        
//         System.out.println("✅ Sample data loaded successfully!");
//     }

//     private void loadSampleUsers() {
//         if (userRepository.count() == 0) {
//             User user1 = new User();
//             user1.setUserId("user001");
//             user1.setRunnerType("Marathon");
//             user1.setBudgetInterest(500.0f);
//             user1.setPreRunCarbConsumption("Low");
//             user1.setPreRunFatConsumption("High");
//             user1.setPreRunProteinConsumption("High");
//             user1.setPostRunCarbConsumption("Low");
//             user1.setPostRunFatConsumption("High");
//             user1.setPostRunProteinConsumption("High");
//             user1.setFoodTypeInterests(Arrays.asList("Japanese", "Thai"));
//             user1.setRestaurantTypeInterests(Arrays.asList("Fast Dining", "Casual Dining"));
            
//             User user2 = new User();
//             user2.setUserId("user002");
//             user2.setRunnerType("Sprint");
//             user2.setBudgetInterest(300.0f);
//             user2.setPreRunCarbConsumption("High");
//             user2.setPreRunFatConsumption("Low");
//             user2.setPreRunProteinConsumption("Medium");
//             user2.setPostRunCarbConsumption("Medium");
//             user2.setPostRunFatConsumption("Low");
//             user2.setPostRunProteinConsumption("High");
//             user2.setFoodTypeInterests(Arrays.asList("Italian", "Mexican"));
//             user2.setRestaurantTypeInterests(Arrays.asList("Casual Dining"));
            
//             userRepository.saveAll(Arrays.asList(user1, user2));
//             System.out.println("👥 Sample users loaded: " + userRepository.count());
//         }
//     }

//     private void loadSampleRestaurants() {
//         if (restaurantRepository.count() == 0) {
//             Restaurant restaurant1 = new Restaurant();
//             restaurant1.setRestaurantId("rest001");
//             restaurant1.setRestaurantName("Sushi Master");
//             restaurant1.setCuisineType("Japanese");
//             restaurant1.setRestaurantType("Fast Dining");
//             restaurant1.setLocation("Bangkok");
//             restaurant1.setNationality("Japanese");
//             restaurant1.setBudget(450.0f);
//             restaurant1.setTelephone("02-123-4567");
            
//             Restaurant.NutritionProfile nutrition1 = new Restaurant.NutritionProfile("Low", "High", "High");
//             restaurant1.setNutritionProfile(nutrition1);
            
//             Restaurant restaurant2 = new Restaurant();
//             restaurant2.setRestaurantId("rest002");
//             restaurant2.setRestaurantName("Thai Spice");
//             restaurant2.setCuisineType("Thai");
//             restaurant2.setRestaurantType("Casual Dining");
//             restaurant2.setLocation("Bangkok");
//             restaurant2.setNationality("Thai");
//             restaurant2.setBudget(350.0f);
//             restaurant2.setTelephone("02-234-5678");
            
//             Restaurant.NutritionProfile nutrition2 = new Restaurant.NutritionProfile("Medium", "Medium", "High");
//             restaurant2.setNutritionProfile(nutrition2);
            
//             Restaurant restaurant3 = new Restaurant();
//             restaurant3.setRestaurantId("rest003");
//             restaurant3.setRestaurantName("Pizza Palace");
//             restaurant3.setCuisineType("Italian");
//             restaurant3.setRestaurantType("Casual Dining");
//             restaurant3.setLocation("Bangkok");
//             restaurant3.setNationality("Italian");
//             restaurant3.setBudget(280.0f);
//             restaurant3.setTelephone("02-345-6789");
            
//             Restaurant.NutritionProfile nutrition3 = new Restaurant.NutritionProfile("High", "Medium", "Medium");
//             restaurant3.setNutritionProfile(nutrition3);
            
//             restaurantRepository.saveAll(Arrays.asList(restaurant1, restaurant2, restaurant3));
//             System.out.println("🍽️ Sample restaurants loaded: " + restaurantRepository.count());
//         }
//     }
// }
