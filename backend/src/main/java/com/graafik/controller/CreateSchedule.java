package com.backend.graafik.controller;

import com.backend.graafik.model.ScheduleRequest;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MessageController {

    @PostMapping("/create-schedule")
    public ResponseEntity<String> processSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        System.out.println("Received ScheduleRequest: " + scheduleRequest.getSelectedMonth());
        return ResponseEntity.ok("Schedule processed!");
    }

}
