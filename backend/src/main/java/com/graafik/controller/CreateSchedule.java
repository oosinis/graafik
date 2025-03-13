package com.graafik.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.services.ScheduleService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CreateSchedule {

    ScheduleService service = new ScheduleService();

    @PostMapping("/create-schedule")
    public ResponseEntity<Schedule> processSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        var result = service.Generate(scheduleRequest);
        System.out.println("Received ScheduleRequest: " + scheduleRequest.getMonth());
        return ResponseEntity.ok(result);
    }

}
