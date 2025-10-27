package com.graafik.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.graafik.dto.ShiftDTO;
import com.graafik.services.ShiftService;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftDTO> getShiftById(@PathVariable UUID id) {
        Optional<ShiftDTO> shift = shiftService.getShiftById(id);
        return shift
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ShiftDTO>> getAllShifts() {
        List<ShiftDTO> shifts = shiftService.getAllShifts();
        return ResponseEntity.ok(shifts);
    }

    @PostMapping
    public ShiftDTO createShift(@RequestBody ShiftDTO shift) {
        return shiftService.saveShift(shift);
    }
}

