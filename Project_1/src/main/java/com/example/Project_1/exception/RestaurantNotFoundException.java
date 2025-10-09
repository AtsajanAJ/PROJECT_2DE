package com.example.Project_1.exception;

public class RestaurantNotFoundException extends RuntimeException {
    
    public RestaurantNotFoundException(String message) {
        super(message);
    }
    
    public RestaurantNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
