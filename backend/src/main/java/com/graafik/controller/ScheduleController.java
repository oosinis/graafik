package com.graafik.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.services.ScheduleGeneratorService;


@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @PostMapping("/generate")
    public ResponseEntity<List<Schedule>> generateSchedule(@RequestBody ScheduleRequest request) {
        List<Schedule> schedules = GenerateSchedule.generateSchedule(request);
        return ResponseEntity.ok(schedules);
    }
}
