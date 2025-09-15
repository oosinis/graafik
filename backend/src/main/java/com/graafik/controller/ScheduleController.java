package com.graafik.controller;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Worker;
import com.graafik.services.ScheduleService;
import com.graafik.services.WorkerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;
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
        Schedule schedule = scheduleService.createSchedule(scheduleRequest);
        // TODO mis saab kui ei ole graafikut
        if (schedule == null) return ResponseEntity.badRequest().build();
        return ResponseEntity
                .created(URI.create("/api/schedules/" + schedule.getId()))
                .body(schedule);
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable UUID id) {
        Optional<Schedule> schedule = scheduleService.getScheduleById(id);
        // kui seda pole olemas siis 404
        // TODO mis frontis saab
        if (schedule.isEmpty()) ResponseEntity.notFound().build();
        return ResponseEntity.ok(schedule.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable UUID id,
                                                @RequestBody ScheduleRequest scheduleRequest,
                                                @RequestParam int startDate,
                                                @RequestParam int endDate,
                                                @RequestParam UUID workerId) {

        Optional<Schedule> schedule = scheduleService.getScheduleById(id);
        if (schedule.isEmpty()) return ResponseEntity.notFound().build();

        Optional<Worker> worker = workerService.getWorkerById(workerId);
        if (worker.isEmpty()) return ResponseEntity.notFound().build();

        Optional<Schedule> updated_schedule = scheduleService.updateSchedule(scheduleRequest, schedule.get(), startDate, endDate, worker.get());

        // TODO front 404
        if (updated_schedule.isEmpty()) ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated_schedule.get());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id) {
        boolean deleted = scheduleService.deleteSchedule(id);
        // 204
        if (deleted) return ResponseEntity.noContent().build();
        // 404
        return ResponseEntity.notFound().build();
    }
}
