package com.example.Project_1.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

/**
 * Simple Rate Limiting Filter to prevent API abuse
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Autowired
    private Map<String, Map<String, Long>> rateLimitMaps;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                  @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String bucketKey = getBucketKey(requestURI);
        
        if (bucketKey != null) {
            Map<String, Long> rateLimitMap = rateLimitMaps.get(bucketKey);
            String clientIp = getClientIpAddress(request);
            long currentTime = System.currentTimeMillis();
            
            // Check rate limit
            if (isRateLimited(rateLimitMap, clientIp, currentTime, bucketKey)) {
                System.err.println("🚫 Rate limit exceeded for: " + requestURI + " from IP: " + clientIp);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }
        
        // Request allowed
        filterChain.doFilter(request, response);
    }

    /**
     * Check if request is rate limited
     */
    private boolean isRateLimited(Map<String, Long> rateLimitMap, String clientIp, long currentTime, String bucketKey) {
        Long lastRequestTime = rateLimitMap.get(clientIp);
        
        if (lastRequestTime == null) {
            rateLimitMap.put(clientIp, currentTime);
            return false;
        }
        
        long timeDiff = currentTime - lastRequestTime;
        long minInterval = getMinInterval(bucketKey);
        
        if (timeDiff < minInterval) {
            return true; // Rate limited
        }
        
        rateLimitMap.put(clientIp, currentTime);
        return false;
    }

    /**
     * Get minimum interval between requests based on bucket type
     */
    private long getMinInterval(String bucketKey) {
        // Check if running in test mode (disable rate limiting)
        String activeProfile = System.getProperty("spring.profiles.active", "");
        if (activeProfile.contains("test") || System.getProperty("test.mode") != null) {
            return 0; // No rate limiting in test mode
        }
        
        switch (bucketKey) {
            case "auth":
                return 6000; // 10 requests per minute = 6 seconds between requests
            case "recommendations":
                return 3000; // 20 requests per minute = 3 seconds between requests
            case "general":
                return 100; // 100 requests per minute = 0.1 seconds between requests (more lenient)
            default:
                return 100; // 0.1 second default (very lenient)
        }
    }

    /**
     * Get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * Determine which bucket to use based on request URI
     */
    private String getBucketKey(String requestURI) {
        if (requestURI.contains("/api/auth/")) {
            return "auth";
        } else if (requestURI.contains("/api/restaurants/recommendations")) {
            return "recommendations";
        } else if (requestURI.contains("/api/")) {
            return "general";
        }
        return null; // No rate limiting
    }
}
