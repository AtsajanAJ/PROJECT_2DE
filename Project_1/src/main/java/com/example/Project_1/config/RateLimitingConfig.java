package com.example.Project_1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple Rate Limiting Configuration
 */
@Configuration
public class RateLimitingConfig {

    /**
     * Create simple rate limiting maps for different endpoints
     */
    @Bean
    public Map<String, Map<String, Long>> rateLimitMaps() {
        Map<String, Map<String, Long>> rateLimitMaps = new ConcurrentHashMap<>();
        
        // General API rate limit: 100 requests per minute
        rateLimitMaps.put("general", new ConcurrentHashMap<>());
        
        // Authentication rate limit: 10 requests per minute
        rateLimitMaps.put("auth", new ConcurrentHashMap<>());
        
        // Restaurant recommendations: 20 requests per minute
        rateLimitMaps.put("recommendations", new ConcurrentHashMap<>());
        
        return rateLimitMaps;
    }
}
