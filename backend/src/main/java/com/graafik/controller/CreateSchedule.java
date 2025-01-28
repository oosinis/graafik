package com.graafik.controller;

import com.graafik.model.ScheduleRequest;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CreateSchedule {

    @PostMapping("/create-schedule")
    public ResponseEntity<String> processSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        System.out.println("Received ScheduleRequest: " + scheduleRequest.getMonth());
        return ResponseEntity.ok("Schedule processed!");
    }

}
