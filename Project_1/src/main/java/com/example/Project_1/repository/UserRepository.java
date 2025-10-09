package com.example.Project_1.repository;

import com.example.Project_1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByUserId(String userId);
    
    List<User> findByRunnerType(String runnerType);
    
    List<User> findByBudgetInterestLessThanEqual(float maxBudget);
    
    @Query("SELECT u FROM User u WHERE u.runnerType = :runnerType AND u.budgetInterest <= :maxBudget")
    List<User> findByRunnerTypeAndBudget(@Param("runnerType") String runnerType, @Param("maxBudget") float maxBudget);
    
    boolean existsByUserId(String userId);
}
