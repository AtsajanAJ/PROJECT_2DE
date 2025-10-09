package com.example.Project_1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebServiceConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")  // Allow CORS for all endpoints
            .allowedOrigins("http://localhost:3000")  // Allow frontend origin (adjust the port if needed)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allowed HTTP methods
            .allowedHeaders("*")  // Allow all headers
            .allowCredentials(true)  // Allow credentials (cookies, authorization headers, etc)
            .maxAge(3600);  // Cache preflight requests for 1 hour
    }
}
