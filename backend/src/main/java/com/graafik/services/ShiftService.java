package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.graafik.model.Shift;
import com.graafik.repositories.ShiftRepository;

@Service
public class ShiftService {
    private final ShiftRepository shiftRepository;

    public ShiftService(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    public Shift saveShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    public List<Shift> saveAll(List<Shift> shifts) {
        return shiftRepository.saveAll(shifts);
    }

    public Optional<Shift> getShiftById(UUID id) {
        return shiftRepository.findById(id);
    }

    public boolean deleteShift(UUID id) {
        if (shiftRepository.existsById(id)) {
            shiftRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
