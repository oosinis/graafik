package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.model.Entities.Employee;
import com.graafik.model.Entities.Rule;
import com.graafik.model.Entities.Shift;
import com.graafik.repositories.EmployeeRepository;
import com.graafik.repositories.RuleRepository;
import com.graafik.repositories.ShiftAssignmentRepository;
import com.graafik.repositories.ShiftRepository;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final RuleRepository ruleRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final EmployeeRepository employeeRepository;

    public ShiftService(ShiftRepository shiftRepository, RuleRepository ruleRepository, ShiftAssignmentRepository shiftAssignmentRepository, EmployeeRepository employeeRepository) {
        this.shiftRepository = shiftRepository;
        this.ruleRepository = ruleRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAllByDeletedFalse();
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
        
        // For new shifts, ensure rules are linked, then save
        if (shift.getRules() != null) {
             shift.getRules().forEach(rule -> rule.setShift(shift));
        }
        return shiftRepository.save(shift);
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
                    // Remove shift from all employees who have it assigned
                    List<Employee> employees = employeeRepository.findAllByAssignedShiftsContaining(shift);
                    for (Employee employee : employees) {
                        employee.getAssignedShifts().remove(shift);
                        employeeRepository.save(employee);
                    }

                    long assignmentCount = shiftAssignmentRepository.countByShiftId(id);
                    if (assignmentCount > 0) {
                        shift.setDeleted(true);
                        shiftRepository.save(shift);
                    } else {
                        shiftRepository.delete(shift);
                    }
                    return true;
                })
                .orElse(false);
    }

}
