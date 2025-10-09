package com.example.Project_1.exception;

import com.example.Project_1.model.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Arrays;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGlobalException(Exception ex, WebRequest request) {
        String message = "An unexpected error occurred: " + ex.getMessage();
        List<String> errors = Arrays.asList(ex.getMessage());
        
        ApiResponse<String> response = ApiResponse.error(message, errors);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        String message = "Invalid input: " + ex.getMessage();
        List<String> errors = Arrays.asList(ex.getMessage());
        
        ApiResponse<String> response = ApiResponse.error(message, errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex, WebRequest request) {
        String message = "Runtime error: " + ex.getMessage();
        List<String> errors = Arrays.asList(ex.getMessage());
        
        ApiResponse<String> response = ApiResponse.error(message, errors);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
