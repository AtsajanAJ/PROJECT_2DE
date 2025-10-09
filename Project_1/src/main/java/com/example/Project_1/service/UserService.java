package com.example.Project_1.service;

import com.example.Project_1.model.User;
import com.example.Project_1.repository.UserRepository;
import com.example.Project_1.exception.UserNotFoundException;
import com.example.Project_1.exception.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        if (userRepository.existsByUserId(user.getUserId())) {
            throw new UserAlreadyExistsException("User with ID " + user.getUserId() + " already exists");
        }
        
        // Validate user data
        validateUser(user);
        
        return userRepository.save(user);
    }

    public boolean userExists(String userId) {
        return userRepository.existsByUserId(userId);
    }

    public User getUserById(String userId) {
        Optional<User> user = userRepository.findByUserId(userId);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new UserNotFoundException("User not found with ID: " + userId);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(String userId, User userDetails) {
        User existingUser = getUserById(userId);
        
        // Update fields
        existingUser.setRunnerType(userDetails.getRunnerType());
        existingUser.setBudgetInterest(userDetails.getBudgetInterest());
        existingUser.setPreRunCarbConsumption(userDetails.getPreRunCarbConsumption());
        existingUser.setPreRunFatConsumption(userDetails.getPreRunFatConsumption());
        existingUser.setPreRunProteinConsumption(userDetails.getPreRunProteinConsumption());
        existingUser.setPostRunCarbConsumption(userDetails.getPostRunCarbConsumption());
        existingUser.setPostRunFatConsumption(userDetails.getPostRunFatConsumption());
        existingUser.setPostRunProteinConsumption(userDetails.getPostRunProteinConsumption());
        existingUser.setFoodTypeInterests(userDetails.getFoodTypeInterests());
        existingUser.setRestaurantTypeInterests(userDetails.getRestaurantTypeInterests());
        
        validateUser(existingUser);
        
        return userRepository.save(existingUser);
    }

    public void deleteUser(String userId) {
        if (!userRepository.existsByUserId(userId)) {
            throw new UserNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    public List<User> getUsersByRunnerType(String runnerType) {
        return userRepository.findByRunnerType(runnerType);
    }

    public List<User> getUsersByBudgetRange(float maxBudget) {
        return userRepository.findByBudgetInterestLessThanEqual(maxBudget);
    }

    private void validateUser(User user) {
        if (user.getUserId() == null || user.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        
        if (user.getRunnerType() == null || user.getRunnerType().trim().isEmpty()) {
            throw new IllegalArgumentException("Runner type cannot be null or empty");
        }
        
        if (user.getBudgetInterest() < 0) {
            throw new IllegalArgumentException("Budget interest cannot be negative");
        }
        
        // Validate nutrition values
        validateNutritionValue(user.getPreRunCarbConsumption(), "Pre-run carb consumption");
        validateNutritionValue(user.getPreRunFatConsumption(), "Pre-run fat consumption");
        validateNutritionValue(user.getPreRunProteinConsumption(), "Pre-run protein consumption");
        validateNutritionValue(user.getPostRunCarbConsumption(), "Post-run carb consumption");
        validateNutritionValue(user.getPostRunFatConsumption(), "Post-run fat consumption");
        validateNutritionValue(user.getPostRunProteinConsumption(), "Post-run protein consumption");
    }

    private void validateNutritionValue(String value, String fieldName) {
        if (value != null && !value.trim().isEmpty()) {
            String lowerValue = value.toLowerCase();
            if (!lowerValue.equals("low") && !lowerValue.equals("medium") && !lowerValue.equals("high")) {
                throw new IllegalArgumentException(fieldName + " must be one of: Low, Medium, High");
            }
        }
    }
}
