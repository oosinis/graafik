package com.graafik.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Worker;
import com.graafik.services.ScheduleService;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping("/regenerate/{scheduleId}")
    public ResponseEntity<List<Schedule>> regenerateSchedule (
        @PathVariable UUID scheduleId,
        @RequestBody RegenerateRequest requestBody
    ) {
        List<Schedule> regeneratedSchedules = scheduleService.regenerateSchedule(
            scheduleId,
            requestBody.getStartDate(),
            requestBody.getEndDate(),
            requestBody.getMissingWorker(),
            requestBody.getScheduleRequest()
        );

        return ResponseEntity.ok(regeneratedSchedules);
    }

    public static class RegenerateRequest {
    private UUID scheduleId;
    private int startDate;
    private int endDate;
    private Worker missingWorker;
    private ScheduleRequest scheduleRequest;

    public int getStartDate() { return startDate; }
    public void setStartDate(int startDate) { this.startDate = startDate; }

    public int getEndDate() { return endDate; }
    public void setEndDate(int endDate) { this.endDate = endDate; }

    public Worker getMissingWorker() { return missingWorker; }
    public void setMissingWorker(Worker missingWorker) { this.missingWorker = missingWorker; }

    public ScheduleRequest getScheduleRequest() { return scheduleRequest; }
    public void setScheduleRequest(ScheduleRequest scheduleRequest) { this.scheduleRequest = scheduleRequest; }


}

}
