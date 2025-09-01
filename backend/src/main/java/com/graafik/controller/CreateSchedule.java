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
@CrossOrigin(origins = "*")
public class CreateSchedule {

   ScheduleService service = new ScheduleService(null);

    @PostMapping("/create-schedule")
    public ResponseEntity<Schedule> processSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        //var result = service.createSchedule(scheduleRequest);
        //System.out.println("Received ScheduleRequest: " + scheduleRequest.getMonth());
        return null;//ResponseEntity.ok(result);
    }

}
