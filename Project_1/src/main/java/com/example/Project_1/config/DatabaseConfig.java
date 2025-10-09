package com.example.Project_1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.example.Project_1.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // JPA configuration is handled by Spring Boot auto-configuration
    // based on application.properties
}
