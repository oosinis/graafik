package com.graafik.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.graafik.services.*;
import com.graafik.model.Shift;


@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping
    public List<Shift> getAllWorkers() {
        return shiftService.getAllShifts();
    }

    @PostMapping
    public Shift createWorker(@RequestBody Shift shift) {
        return shiftService.saveShift(shift);
    }
}

