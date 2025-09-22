package com.graafik.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.graafik.dto.ScheduleDTO;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Worker;
import com.graafik.services.ScheduleService;
import com.graafik.services.WorkerService;

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
    public ResponseEntity<ScheduleDTO> createSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        ScheduleDTO schedule = scheduleService.createSchedule(scheduleRequest);
        if (schedule == null) return ResponseEntity.badRequest().build();
        return ResponseEntity
                .created(URI.create("/api/schedules/" + schedule.getId()))
                .body(schedule);
    }

    @GetMapping
    public ResponseEntity<List<ScheduleDTO>> getAllSchedules() {
        List<ScheduleDTO> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDTO> getScheduleById(@PathVariable UUID id) {
        Optional<ScheduleDTO> scheduleOpt = scheduleService.getScheduleById(id);
        return scheduleOpt
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleDTO> updateSchedule(
            @PathVariable UUID id,
            @RequestBody ScheduleRequest scheduleRequest,
            @RequestParam int startDate,
            @RequestParam int endDate,
            @RequestParam UUID workerId
    ) {

        Optional<Worker> workerOpt = workerService.getWorkerById(workerId);
        if (workerOpt.isEmpty()) return ResponseEntity.notFound().build();

        Optional<ScheduleDTO> schedule = scheduleService.getScheduleById(id);
        if (schedule.isEmpty()) return ResponseEntity.notFound().build();

        Optional<ScheduleDTO> updatedOpt = scheduleService.updateSchedule(
                scheduleRequest,
                id,
                startDate,
                endDate,
                workerOpt.get()
        );

        return updatedOpt
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
