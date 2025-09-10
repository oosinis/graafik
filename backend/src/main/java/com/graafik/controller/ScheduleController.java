package com.graafik.controller;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.services.ScheduleService;
import com.graafik.services.WorkerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final WorkerService workerService;

    public ScheduleController(ScheduleService scheduleService, WorkerService workerService) {
        this.scheduleService = scheduleService;
        this.workerService = workerService;
    }

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        Schedule saved = scheduleService.createSchedule(scheduleRequest);
        return ResponseEntity
                .created(URI.create("/api/schedules/" + saved.getId()))
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable UUID id) {
        return scheduleService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()); // ??????????????
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable UUID id,
                                                @RequestBody ScheduleRequest scheduleRequest,
                                                @RequestParam int startDate,
                                                @RequestParam int endDate,
                                                @RequestParam UUID workerId) {
        return scheduleService.getScheduleById(id)
                .flatMap(current -> workerService.getWorkerById(workerId)
                        .flatMap(worker -> scheduleService.updateSchedule(
                                scheduleRequest, current, startDate, endDate, worker)))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id) {
        boolean deleted = scheduleService.deleteSchedule(id);
        return deleted ? ResponseEntity.noContent().build()
                       : ResponseEntity.notFound().build();
    }
}
