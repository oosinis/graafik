package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.graafik.model.Shift;
import com.graafik.model.Rule;
import com.graafik.repositories.RuleRepository;
import com.graafik.repositories.ShiftRepository;

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
                if (rule.getShiftId() == null) {
                    rule.setShiftId(savedShift.getId());
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
}
