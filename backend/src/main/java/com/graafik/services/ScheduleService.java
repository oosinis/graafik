package com.graafik.services;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final DayScheduleRepository dayScheduleRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;


    public ScheduleService(ScheduleRepository scheduleRepository, 
                        ShiftService shiftService, 
                        EmployeeRepository employeeRepository,
                        DayScheduleRepository dayScheduleRepository,
                        ShiftAssignmentRepository shiftAssignmentRepository) {
        this.scheduleRepository = scheduleRepository;
        this.shiftService = shiftService;
        this.employeeRepository = employeeRepository;
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

            List<Employee> managedEmployees = request.getEmployees().stream()
                .map(employeeRepository::save)
                .toList();
            request.setEmployees(managedEmployees);

            List<ScheduleAlg> algSchedules = GenerateSchedule.generateSchedule(request);

            if (algSchedules == null || algSchedules.isEmpty()) {
                throw new BadRequestException("Schedule generation failed: no valid schedule produced from input data.");
            }

            ScheduleAlg bestSchedule = algSchedules.stream()
                .max(Comparator.comparingDouble(ScheduleAlg::getScore))
                .orElse(null);

            saveSchedule(fromAlg(bestSchedule));

            return fromAlg(bestSchedule);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Unexpected error during schedule creation: " + e.getMessage());
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

        return new Schedule(
            schedule.getMonth(),
            schedule.getYear(),
            schedule.getScore(),
            schedule.getFullTimeMinutes(),
            schedule.getDaySchedules(),
            employeeHoursInMinCountingUp
        );
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

        var savedSchedule = scheduleRepository.save(schedule);
        
        if (schedule.getDaySchedules() != null && !schedule.getDaySchedules().isEmpty()) {
            schedule.getDaySchedules().forEach(ds -> {
                if (ds.getSchedule() == null) {
                    ds.setSchedule(savedSchedule);
                }

                if (ds.getAssignments() != null && !ds.getAssignments().isEmpty()) {
                    DaySchedule savedDaySchedule = dayScheduleRepository.save(ds);
                    ds.getAssignments().forEach(sa -> {
                        if (sa.getDaySchedule() == null) {
                            sa.setDaySchedule(savedDaySchedule);
                        }
                    });
                    shiftAssignmentRepository.saveAll(ds.getAssignments());
                }

            });
        }
        return savedSchedule;
    }
}
