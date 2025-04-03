package com.graafik.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloApi {
    @GetMapping("/")
    public String home() {
        return "Welcome to the Grafik API!";
    }
}
