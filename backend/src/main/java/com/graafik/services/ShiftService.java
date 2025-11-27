package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.model.Entities.Rule;
import com.graafik.model.Entities.Shift;
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
        return shiftRepository.findAll();
    }

    public Optional<Shift> getShiftById(UUID id) {
        return shiftRepository.findById(id)
                .map(shift -> {
                    shift.setRules(ruleRepository.findByShiftId(id));
                    return shift;
                });
    }

    
    @Transactional
    public Shift saveShift(Shift shift) {
        // If shift already exists, fetch it and return without modifying
        // DO NOT call setRules() as it replaces the managed collection and triggers orphanRemoval
        if (shift.getId() != null && shiftRepository.existsById(shift.getId())) {
            Optional<Shift> existingShiftOpt = shiftRepository.findById(shift.getId());
            if (existingShiftOpt.isPresent()) {
                Shift existingShift = existingShiftOpt.get();
                // Trigger lazy loading of rules if needed, but don't replace the collection
                // Accessing getRules() will load them if lazy, without replacing the managed collection
                existingShift.getRules().size(); // Force lazy load if needed
                return existingShift;
            }
        }
        
        // For new shifts, save normally
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


    @Transactional
    public Optional<Shift> updateShift(UUID id, Shift updatedShift) {
        return shiftRepository.findById(id).map(existingShift -> {

            existingShift.setName(updatedShift.getName());
            existingShift.setStartTime(updatedShift.getStartTime());
            existingShift.setEndTime(updatedShift.getEndTime());

            List<Rule> existingRules = ruleRepository.findByShiftId(id);

            // Delete removed rules
            existingRules.stream()
                .filter(er -> updatedShift.getRules().stream()
                    .noneMatch(ur -> ur.getId() != null && ur.getId().equals(er.getId())))
                .forEach(ruleRepository::delete);

            // update rules
            updatedShift.getRules().forEach(rule -> {
                rule.setShift(existingShift);
                ruleRepository.save(rule);
            });

            shiftRepository.save(existingShift);

            existingShift.getRules().clear();
            existingShift.getRules().addAll(ruleRepository.findByShiftId(id));

            return existingShift;
        });
    }

    @Transactional
    public boolean deleteShift(UUID id) {
        return shiftRepository.findById(id)
                .map(shift -> {
                    shiftRepository.delete(shift);
                    return true;
                })
                .orElse(false);
    }

}
