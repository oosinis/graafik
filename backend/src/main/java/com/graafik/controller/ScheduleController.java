package com.graafik.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;
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

import com.graafik.model.Domain.*;
import com.graafik.model.Entities.*;
import com.graafik.model.Dtos.*;
import com.graafik.services.ScheduleService;
import com.graafik.services.EmployeeService;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final EmployeeService employeeService;

    public ScheduleController(ScheduleService scheduleService, EmployeeService employeeService) {
        this.scheduleService = scheduleService;
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody ScheduleRequest scheduleRequestDTO) {

        Schedule schedule = scheduleService.createSchedule(scheduleRequestDTO);

        return ResponseEntity
                .created(URI.create("/api/schedules/" + schedule.getId()))
                .body(schedule);
        
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable UUID id) {
        Optional<Schedule> scheduleOpt = scheduleService.getScheduleById(id);
        return scheduleOpt
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/latest")
    public ResponseEntity<Schedule> getLatestScheduleByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        Optional<Schedule> scheduleOpt = scheduleService.getLatestScheduleByMonthAndYear(month, year);
        return scheduleOpt
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(
            @PathVariable UUID id,
            @RequestBody ScheduleRequest scheduleRequest,
            @RequestParam int startDate,
            @RequestParam int endDate,
            @RequestParam UUID employeeId
    ) {

        Optional<Employee> employeeOpt = employeeService.getEmployeeById(employeeId);
        if (employeeOpt.isEmpty()) {
            return ResponseEntity
                .status(404)
                .body(Map.of("error", "Employee with id " + employeeId + " not found"));
        }

        Optional<Schedule> scheduleOpt = scheduleService.getScheduleById(id);
        if (scheduleOpt.isEmpty()) {
            return ResponseEntity
                .status(404)
                .body(Map.of("error", "Schedule with id " + id + " not found"));
        }

        Optional<Schedule> updatedOpt = scheduleService.updateSchedule(
                scheduleRequest,
                id,
                startDate,
                endDate,
                employeeOpt.get()
        );

        if (updatedOpt.isEmpty()) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "Failed to update schedule"));
        }

        return ResponseEntity.ok(updatedOpt.get());
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
