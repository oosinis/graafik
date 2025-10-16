package com.graafik.error_magement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // TODO : kas timestamp vajalik, kas peaks midagi veel kaasama?
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequest(BadRequestException ex) {
        return ResponseEntity
                .badRequest()
                .body(Map.of(
                        "error", ex.getMessage(),
                        "timestamp", Instant.now().toString()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Internal server error: " + ex.getMessage(),
                        "timestamp", Instant.now().toString()
                ));
    }
}
