 package com.example.Project_1.config;

import com.example.Project_1.model.User;
import com.example.Project_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Security Data Loader to create test users
 */
@Component
public class SecurityDataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createTestUsers();
    }

    private void createTestUsers() {
        // Create admin user
        if (!userRepository.existsByUserId("admin")) {
            User admin = new User();
            admin.setUserId("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@restaurant-recommendation.com");
            admin.setRunnerType("Marathon");
            admin.setBudgetInterest(1000.0f);
            admin.setPreRunCarbConsumption("Low");
            admin.setPreRunFatConsumption("High");
            admin.setPreRunProteinConsumption("High");
            admin.setPostRunCarbConsumption("High");
            admin.setPostRunFatConsumption("Low");
            admin.setPostRunProteinConsumption("High");
            admin.setFoodTypeInterests(Arrays.asList("Japanese", "Thai", "Italian"));
            admin.setRestaurantTypeInterests(Arrays.asList("Fine Dining", "Casual Dining"));
            
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin/admin123");
        }

        // Create test user
        if (!userRepository.existsByUserId("testuser")) {
            User testUser = new User();
            testUser.setUserId("testuser");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setEmail("test@example.com");
            testUser.setRunnerType("Sprint");
            testUser.setBudgetInterest(500.0f);
            testUser.setPreRunCarbConsumption("Medium");
            testUser.setPreRunFatConsumption("Low");
            testUser.setPreRunProteinConsumption("Medium");
            testUser.setPostRunCarbConsumption("High");
            testUser.setPostRunFatConsumption("Low");
            testUser.setPostRunProteinConsumption("High");
            testUser.setFoodTypeInterests(Arrays.asList("Thai", "Japanese"));
            testUser.setRestaurantTypeInterests(Arrays.asList("Fast Dining", "Casual Dining"));
            
            userRepository.save(testUser);
            System.out.println("✅ Test user created: testuser/password123");
        }

        // Create demo user
        if (!userRepository.existsByUserId("demo")) {
            User demoUser = new User();
            demoUser.setUserId("demo");
            demoUser.setPassword(passwordEncoder.encode("demo123"));
            demoUser.setEmail("demo@example.com");
            demoUser.setRunnerType("Marathon");
            demoUser.setBudgetInterest(800.0f);
            demoUser.setPreRunCarbConsumption("Low");
            demoUser.setPreRunFatConsumption("High");
            demoUser.setPreRunProteinConsumption("High");
            demoUser.setPostRunCarbConsumption("High");
            demoUser.setPostRunFatConsumption("Low");
            demoUser.setPostRunProteinConsumption("High");
            demoUser.setFoodTypeInterests(Arrays.asList("Japanese", "Thai", "Italian", "Chinese"));
            demoUser.setRestaurantTypeInterests(Arrays.asList("Fine Dining", "Casual Dining", "Fast Dining"));
            
            userRepository.save(demoUser);
            System.out.println("✅ Demo user created: demo/demo123");
        }

        System.out.println("🔐 Security test users loaded successfully!");
    }
}
