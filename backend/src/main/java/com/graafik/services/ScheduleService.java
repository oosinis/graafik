package com.graafik.services;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.graafik.error_magement.BadRequestException;
import com.graafik.model.Domain.*;
import com.graafik.model.Entities.*;
import com.graafik.model.Dtos.*;
import com.graafik.repositories.*;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.schedule.RegenerateExistingSchedule;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ShiftService shiftService;
    private final EmployeeRepository employeeRepository;
    private final ShiftRepository shiftRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ScheduleService(ScheduleRepository scheduleRepository, 
                        ShiftService shiftService, 
                        EmployeeRepository employeeRepository,
                        ShiftRepository shiftRepository,
                        DayScheduleRepository dayScheduleRepository,
                        ShiftAssignmentRepository shiftAssignmentRepository) {
        this.scheduleRepository = scheduleRepository;
        this.shiftService = shiftService;
        this.employeeRepository = employeeRepository;
        this.shiftRepository = shiftRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    @Transactional
    public Schedule createSchedule(ScheduleRequest request) {
        try {

            if (request.getShifts() == null || request.getShifts().isEmpty()) {
                throw new BadRequestException("No shifts provided for schedule creation.");
            }

            for (Shift shift : request.getShifts()) {
                if (shift.getRules() == null || shift.getRules().isEmpty()) {
                    throw new BadRequestException("Every shift must have at least one rule. Shift '" + shift.getName() + "' has none.");
                }
            }

            if (request.getEmployees() == null || request.getEmployees().isEmpty()) {
                throw new BadRequestException("No employees provided for schedule creation.");
            }

            List<Shift> managedShifts = request.getShifts().stream()
                .map(shift -> {
                    Shift saved = shiftService.saveShift(shift);
                    return saved;
                })
                .toList();
            request.setShifts(managedShifts);

            // For existing employees, fetch managed entities to avoid cascade issues
            List<Employee> managedEmployees = request.getEmployees().stream()
                .map(employee -> {
                    if (employee.getId() != null && employeeRepository.existsById(employee.getId())) {
                        return employeeRepository.findById(employee.getId()).orElse(employee);
                    }
                    return employeeRepository.save(employee);
                })
                .toList();
            request.setEmployees(managedEmployees);

            List<ScheduleAlg> algSchedules = GenerateSchedule.generateSchedule(request);

            if (algSchedules == null || algSchedules.isEmpty()) {
                throw new BadRequestException("Schedule generation failed: no valid schedule produced from input data.");
            }

            ScheduleAlg bestSchedule = algSchedules.stream()
                .max(Comparator.comparingDouble(ScheduleAlg::getScore))
                .orElse(null);

            Schedule scheduleToSave = fromAlg(bestSchedule);
            saveSchedule(scheduleToSave);

            return fromAlg(bestSchedule);
        } catch (BadRequestException e) {
            throw e;
        } catch (IllegalStateException e) {
            // Include full error message for validation errors
            System.err.println("❌ IllegalStateException during schedule creation: " + e.getMessage());
            e.printStackTrace();
            throw new BadRequestException("Schedule validation failed: " + e.getMessage());
        } catch (Exception e) {
            // Log full error details for debugging
            System.err.println("❌ Unexpected error during schedule creation: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getName());
            e.printStackTrace();
            
            // Include more context in error message
            String errorMessage = "Unexpected error during schedule creation: " + e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " (Caused by: " + e.getCause().getMessage() + ")";
            }
            throw new BadRequestException(errorMessage);
        }
    }



    @Transactional
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream()
                .toList();
    }

    @Transactional
    public Optional<Schedule> getScheduleById(UUID scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .map(schedule -> {
                    List<DaySchedule> daySchedules = dayScheduleRepository.findByScheduleId(scheduleId);
                    daySchedules.forEach(ds -> {
                        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByDayScheduleId(ds.getId());
                        ds.setAssignments(assignments);
                    });
                    schedule.setDaySchedules(daySchedules);
                    return schedule;
                });
    }

    @Transactional
    public Optional<Schedule> getLatestScheduleByMonthAndYear(int month, int year) {
        return scheduleRepository.findFirstByMonthAndYearOrderByCreatedAtDesc(month, year)
                .map(schedule -> {
                    List<DaySchedule> daySchedules = dayScheduleRepository.findByScheduleId(schedule.getId());
                    daySchedules.forEach(ds -> {
                        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByDayScheduleId(ds.getId());
                        ds.setAssignments(assignments);
                    });
                    schedule.setDaySchedules(daySchedules);
                    return schedule;
                });
    }

    // TODO
    // rn saves the new schedule by default
    // should display multiple schedules to the user save the one they choose
    public Optional<Schedule> updateSchedule(
            ScheduleRequest scheduleRequest,
            UUID scheduleId,
            int startDate,
            int endDate,
            Employee missingEmployee
    ) {
        Optional<Schedule> currentScheduleOpt = scheduleRepository.findById(scheduleId);
        if (currentScheduleOpt.isEmpty()) return Optional.empty();

        Schedule currentSchedule = currentScheduleOpt.get();

        List<ScheduleAlg> schedules = RegenerateExistingSchedule.regenerateSchedule(scheduleRequest,
                toAlg(currentSchedule),
                startDate,
                endDate,
                missingEmployee
        );

        if (schedules == null || schedules.isEmpty()) {
            throw new BadRequestException("Failed to regenerate schedule for given date range.");
        }


        // TODO best not first
        Schedule saved = scheduleRepository.save(fromAlg(schedules.get(0)));

        return Optional.of(saved);
    }


    public boolean deleteSchedule(UUID id) {
        Optional<Schedule> scheduleOpt = scheduleRepository.findById(id);
        if (scheduleOpt.isPresent()) {
            
            // We need to manually delete assignments to trigger the shift cleanup logic
            List<DaySchedule> daySchedules = dayScheduleRepository.findByScheduleId(id);
            for (DaySchedule ds : daySchedules) {
                List<ShiftAssignment> assignments = shiftAssignmentRepository.findByDayScheduleId(ds.getId());
                for (ShiftAssignment assignment : assignments) {
                    Shift shift = assignment.getShift();
                    shiftAssignmentRepository.delete(assignment);
                    
                    // Flush to ensure the delete is counted
                    shiftAssignmentRepository.flush();

                    if (shift.isDeleted()) {
                        // veits kilplase lahendus
                        // aga peaks töötama, korralikult saab testida kui scheule genemiseks läheb
                        long remainingAssignments = shiftAssignmentRepository.countByShiftId(shift.getId());
                        if (remainingAssignments == 0) {
                            // We need to use shiftService to delete the shift or access repository directly
                            // Since we don't have shiftRepository here, we can use shiftService.deleteShift which handles the check again
                            // But deleteShift checks for assignments count > 0. If 0, it deletes.
                            shiftService.deleteShift(shift.getId());
                        }
                    }
                }
                // Ensure DaySchedule is deleted if not cascaded (though it should be by Schedule cascade)
                // If Schedule -> DaySchedule is Cascade.ALL, we don't need to delete explicitly, 
            }

            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private Schedule fromAlg(ScheduleAlg schedule) {
        // Get all employees referenced in employeeHours
        // Tuleb muuta see halb lahendus
        List<Employee> employees = schedule.getEmployeeHoursInMinutes().keySet().stream()
            .map(employeeId -> employeeRepository.findById(employeeId).orElse(null))
            .filter(employee -> employee != null)
            .toList();

        
        Map<UUID, Long> employeeHoursInMinCountingUp = new HashMap<>();
        for (Employee employee : employees) {
            employeeHoursInMinCountingUp.put(employee.getId(), (long) (schedule.getFullTimeMinutes() * employee.getWorkLoad() + schedule.getEmployeeHoursInMinutes().get(employee.getId())));
        }

        Schedule newSchedule = new Schedule(
            schedule.getMonth(),
            schedule.getYear(),
            schedule.getScore(),
            schedule.getFullTimeMinutes(),
            schedule.getDaySchedules(),
            employeeHoursInMinCountingUp
        );
        
        // Set bidirectional references - Hibernate needs these for cascade operations
        // Without this, Hibernate can't extract the parent ID to populate foreign keys
        if (newSchedule.getDaySchedules() != null) {
            newSchedule.getDaySchedules().forEach(daySchedule -> {
                // Set child → parent reference (DaySchedule → Schedule)
                daySchedule.setSchedule(newSchedule);
                
                // Also set grandchild → child references (ShiftAssignment → DaySchedule)
                if (daySchedule.getAssignments() != null) {
                    daySchedule.getAssignments().forEach(assignment -> {
                        assignment.setDaySchedule(daySchedule);
                        
                        // Validate that Employee and Shift references are set
                        if (assignment.getEmployee() == null) {
                            throw new IllegalStateException("ShiftAssignment has null employee reference - this indicates a bug in the schedule generation algorithm");
                        }
                        if (assignment.getShift() == null) {
                            throw new IllegalStateException("ShiftAssignment has null shift reference - this indicates a bug in the schedule generation algorithm");
                        }
                        
                        // Replace with managed entities to ensure they're attached to the persistence context
                        // The algorithm may have created detached copies, so we need to re-fetch them
                        if (assignment.getEmployee().getId() != null) {
                            Employee managedEmployee = employeeRepository.findById(assignment.getEmployee().getId())
                                .orElseThrow(() -> new IllegalStateException("Employee not found: " + assignment.getEmployee().getId()));
                            assignment.setEmployee(managedEmployee);
                        } else {
                            System.err.println("⚠️ WARNING: ShiftAssignment has employee with null ID. DaySchedule dayOfMonth: " + daySchedule.getDayOfMonth());
                        }
                        
                        // For Shift, use repository directly to avoid setRules() call that causes cascade issues
                        if (assignment.getShift().getId() != null) {
                            Shift managedShift = shiftRepository.findById(assignment.getShift().getId())
                                .orElseThrow(() -> new IllegalStateException("Shift not found: " + assignment.getShift().getId()));
                            // Don't access getRules() as it might trigger lazy loading and cascade issues
                            assignment.setShift(managedShift);
                        } else {
                            System.err.println("⚠️ WARNING: ShiftAssignment has shift with null ID. DaySchedule dayOfMonth: " + daySchedule.getDayOfMonth());
                        }
                    });
                }
            });
        }
        
        // Log schedule structure before returning
        System.out.println("📋 Schedule structure after fromAlg():");
        System.out.println("  Month: " + newSchedule.getMonth() + ", Year: " + newSchedule.getYear());
        System.out.println("  DaySchedules count: " + (newSchedule.getDaySchedules() != null ? newSchedule.getDaySchedules().size() : 0));
        if (newSchedule.getDaySchedules() != null) {
            newSchedule.getDaySchedules().forEach(ds -> {
                System.out.println("    Day " + ds.getDayOfMonth() + ": " + 
                    (ds.getAssignments() != null ? ds.getAssignments().size() : 0) + " assignments");
                if (ds.getAssignments() != null) {
                    ds.getAssignments().forEach(sa -> {
                        String empInfo = sa.getEmployee() != null ? 
                            (sa.getEmployee().getName() + " (ID: " + sa.getEmployee().getId() + ")") : "NULL";
                        String shiftInfo = sa.getShift() != null ? 
                            (sa.getShift().getName() + " (ID: " + sa.getShift().getId() + ")") : "NULL";
                        System.out.println("      - Employee: " + empInfo + ", Shift: " + shiftInfo);
                    });
                }
            });
        }
        
        return newSchedule;
    }

    private ScheduleAlg toAlg(Schedule scheduleAlg) {
        ScheduleAlg schedule = new ScheduleAlg();
        schedule.setMonth(scheduleAlg.getMonth());
        schedule.setYear(scheduleAlg.getYear());
        schedule.setScore(scheduleAlg.getScore());
        schedule.setDaySchedules(scheduleAlg.getDaySchedules());
        schedule.setEmployeeHoursInMinutes(scheduleAlg.getEmployeeHoursInMins());
        return schedule;
    }

    private Schedule saveSchedule(Schedule schedule) {
        // Log schedule structure before save
        System.out.println("💾 About to save Schedule:");
        System.out.println("  Month: " + schedule.getMonth() + ", Year: " + schedule.getYear() + ", Score: " + schedule.getScore());
        System.out.println("  DaySchedules count: " + (schedule.getDaySchedules() != null ? schedule.getDaySchedules().size() : 0));
        
        // Validate all references before attempting save
        // This catches null references before Hibernate tries to cascade save
        if (schedule.getDaySchedules() != null) {
            schedule.getDaySchedules().forEach(ds -> {
                if (ds.getAssignments() != null) {
                    ds.getAssignments().forEach(sa -> {
                        if (sa.getEmployee() == null) {
                            String errorDetails = String.format(
                                "ShiftAssignment has null employee reference. " +
                                "DaySchedule dayOfMonth: %d, Shift: %s, ShiftAssignment ID: %s",
                                ds.getDayOfMonth(),
                                sa.getShift() != null ? (sa.getShift().getName() + " (ID: " + sa.getShift().getId() + ")") : "null",
                                sa.getId() != null ? sa.getId().toString() : "null"
                            );
                            System.err.println("❌ VALIDATION ERROR: " + errorDetails);
                            throw new IllegalStateException(errorDetails);
                        }
                        if (sa.getShift() == null) {
                            String errorDetails = String.format(
                                "ShiftAssignment has null shift reference. " +
                                "DaySchedule dayOfMonth: %d, Employee: %s, ShiftAssignment ID: %s",
                                ds.getDayOfMonth(),
                                sa.getEmployee() != null ? (sa.getEmployee().getName() + " (ID: " + sa.getEmployee().getId() + ")") : "null",
                                sa.getId() != null ? sa.getId().toString() : "null"
                            );
                            System.err.println("❌ VALIDATION ERROR: " + errorDetails);
                            throw new IllegalStateException(errorDetails);
                        }
                        
                        // Check if entities are managed (have IDs and are in persistence context)
                        boolean employeeManaged = sa.getEmployee() != null && sa.getEmployee().getId() != null;
                        boolean shiftManaged = sa.getShift() != null && sa.getShift().getId() != null;
                        if (!employeeManaged || !shiftManaged) {
                            System.err.println("⚠️ WARNING: ShiftAssignment may have transient entities. " +
                                "DaySchedule dayOfMonth: " + ds.getDayOfMonth() + 
                                ", Employee managed: " + employeeManaged + 
                                ", Shift managed: " + shiftManaged);
                        }
                    });
                }
            });
        }

        System.out.println("✅ Validation passed, attempting to save...");
        
        // Before cascade save, ensure all employee/shift references are managed entities
        // This is critical because cascade save needs all references to be in the persistence context
        if (schedule.getDaySchedules() != null) {
            schedule.getDaySchedules().forEach(ds -> {
                if (ds.getAssignments() != null) {
                    ds.getAssignments().forEach(sa -> {
                        // Re-fetch employee to ensure it's a managed entity in the current persistence context
                        if (sa.getEmployee() != null && sa.getEmployee().getId() != null) {
                            Employee managedEmployee = employeeRepository.findById(sa.getEmployee().getId())
                                .orElseThrow(() -> new IllegalStateException("Employee not found before save: " + sa.getEmployee().getId()));
                            sa.setEmployee(managedEmployee);
                        }
                        
                        // Re-fetch shift to ensure it's a managed entity (using repository directly to avoid setRules())
                        if (sa.getShift() != null && sa.getShift().getId() != null) {
                            Shift managedShift = shiftRepository.findById(sa.getShift().getId())
                                .orElseThrow(() -> new IllegalStateException("Shift not found before save: " + sa.getShift().getId()));
                            sa.setShift(managedShift);
                        }
                    });
                }
            });
        }
        
        // CRITICAL: Initialize Schedule ID BEFORE save so DaySchedule can reference it
        // Without this, Hibernate tries to cascade-save DaySchedule before Schedule has an ID
        // which causes TransientPropertyValueException
        schedule.initializeId();
        
        // Now save - the Schedule has an ID that DaySchedule children can reference
        return scheduleRepository.save(schedule);
    }
}
