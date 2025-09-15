package com.graafik.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.graafik.services.*;
import com.graafik.model.Shift;


@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable UUID id) {
        Optional<Shift> shift = shiftService.getShiftById(id);
        // kui seda pole olemas siis 404
        // TODO mis frontis saab
        if (shift.isEmpty()) ResponseEntity.notFound().build();
        return ResponseEntity.ok(shift.get());
    }

    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    @PostMapping
    public Shift createWorker(@RequestBody Shift shift) {
        return shiftService.saveShift(shift);
    }
}

