package com.example.Project_1.service;

import com.example.Project_1.model.User;
import com.example.Project_1.repository.UserRepository;
import com.example.Project_1.exception.UserNotFoundException;
import com.example.Project_1.exception.UserAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId("test001");
        testUser.setRunnerType("Marathon");
        testUser.setBudgetInterest(500.0f);
        testUser.setPreRunCarbConsumption("Low");
        testUser.setPreRunFatConsumption("High");
        testUser.setPreRunProteinConsumption("High");
        testUser.setPostRunCarbConsumption("Low");
        testUser.setPostRunFatConsumption("High");
        testUser.setPostRunProteinConsumption("High");
        testUser.setFoodTypeInterests(Arrays.asList("Japanese", "Thai"));
        testUser.setRestaurantTypeInterests(Arrays.asList("Fast Dining"));
    }

    @Test
    void createUser_Success() {
        // Arrange
        when(userRepository.existsByUserId("test001")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.createUser(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("test001", result.getUserId());
        assertEquals("Marathon", result.getRunnerType());
        verify(userRepository).existsByUserId("test001");
        verify(userRepository).save(testUser);
    }

    @Test
    void createUser_UserAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepository.existsByUserId("test001")).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.createUser(testUser);
        });
        verify(userRepository).existsByUserId("test001");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        // Arrange
        when(userRepository.findByUserId("test001")).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById("test001");

        // Assert
        assertNotNull(result);
        assertEquals("test001", result.getUserId());
        verify(userRepository).findByUserId("test001");
    }

    @Test
    void getUserById_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.findByUserId("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById("nonexistent");
        });
        verify(userRepository).findByUserId("nonexistent");
    }

    @Test
    void updateUser_Success() {
        // Arrange
        User existingUser = new User();
        existingUser.setUserId("test001");
        existingUser.setRunnerType("Sprint");
        existingUser.setBudgetInterest(300.0f);

        User updateData = new User();
        updateData.setRunnerType("Marathon");
        updateData.setBudgetInterest(500.0f);

        when(userRepository.findByUserId("test001")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        User result = userService.updateUser("test001", updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Marathon", result.getRunnerType());
        assertEquals(500.0f, result.getBudgetInterest());
        verify(userRepository).findByUserId("test001");
        verify(userRepository).save(existingUser);
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        when(userRepository.existsByUserId("test001")).thenReturn(true);
        doNothing().when(userRepository).deleteById("test001");

        // Act
        assertDoesNotThrow(() -> userService.deleteUser("test001"));

        // Assert
        verify(userRepository).existsByUserId("test001");
        verify(userRepository).deleteById("test001");
    }

    @Test
    void deleteUser_UserNotFound_ThrowsException() {
        // Arrange
        when(userRepository.existsByUserId("nonexistent")).thenReturn(false);

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            userService.deleteUser("nonexistent");
        });
        verify(userRepository).existsByUserId("nonexistent");
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void getAllUsers_Success() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test001", result.get(0).getUserId());
        verify(userRepository).findAll();
    }

    @Test
    void getUsersByRunnerType_Success() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findByRunnerType("Marathon")).thenReturn(users);

        // Act
        List<User> result = userService.getUsersByRunnerType("Marathon");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Marathon", result.get(0).getRunnerType());
        verify(userRepository).findByRunnerType("Marathon");
    }

    @Test
    void getUsersByBudgetRange_Success() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findByBudgetInterestLessThanEqual(500.0f)).thenReturn(users);

        // Act
        List<User> result = userService.getUsersByBudgetRange(500.0f);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(500.0f, result.get(0).getBudgetInterest());
        verify(userRepository).findByBudgetInterestLessThanEqual(500.0f);
    }

    @Test
    void createUser_InvalidData_ThrowsException() {
        // Arrange
        User invalidUser = new User();
        invalidUser.setUserId(""); // Invalid: empty user ID
        invalidUser.setRunnerType("InvalidType"); // Invalid runner type
        invalidUser.setBudgetInterest(-100.0f); // Invalid: negative budget

        when(userRepository.existsByUserId("")).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(invalidUser);
        });
    }
}
