package com.graafik.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloApi {
    
    @Value("${app.version:0.0.1}")
    private String appVersion;
    
    @Value("${app.build.time:}")
    private String buildTime;
    
    @GetMapping("/")
    public String home() {
        // Format the build time if it's in ISO format
        String formattedTime = buildTime != null && !buildTime.isEmpty() ? buildTime : "N/A";
        if (formattedTime.contains("T") && formattedTime.endsWith("Z")) {
            formattedTime = formattedTime.replace("T", " ").replace("Z", "");
        }
        return String.format("Welcome to the Grafik API! | Version: %s | Build: %s", appVersion, formattedTime);
    }
}
