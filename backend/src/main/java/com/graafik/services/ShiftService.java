package com.graafik.services;

import java.util.*;

import org.springframework.stereotype.Service;

import com.graafik.model.Domain.*;
import com.graafik.model.Entities.*;
import com.graafik.repositories.RuleRepository;
import com.graafik.repositories.ShiftRepository;

import java.time.Duration;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final RuleRepository ruleRepository;

    public ShiftService(ShiftRepository shiftRepository, RuleRepository ruleRepository) {
        this.shiftRepository = shiftRepository;
        this.ruleRepository = ruleRepository;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll()
                .stream()
                .toList();
    }

    public Optional<Shift> getShiftById(UUID id) {
        return shiftRepository.findById(id)
                .map(shift -> {
                    List<Rule> rules = ruleRepository.findByShiftId(id);
                    shift.setRules(rules);
                    return shift;
                });
    }

    public Shift saveShift(Shift shift) {
        var savedShift = shiftRepository.save(shift);

        if (shift.getRules() != null && !shift.getRules().isEmpty()) {
            shift.getRules().forEach(rule -> {
                if (rule.getShift() == null) {
                    rule.setShift(savedShift);
                }
            });
            ruleRepository.saveAll(shift.getRules());
        }

        savedShift.setRules(ruleRepository.findByShiftId(savedShift.getId()));

        return savedShift;
    }


    public boolean deleteShift(UUID id) {
        if (shiftRepository.existsById(id)) {
            shiftRepository.deleteById(id);
            return true;
        }
        return false;
    }


    public static ShiftAlg toAlg(Shift shiftDTO) {

        return new ShiftAlg(shiftDTO.getId(), shiftDTO.getType(), Duration.between(shiftDTO.getStartTime(), shiftDTO.getEndTime()).toMinutes(), shiftDTO.getRules());
    }
}
