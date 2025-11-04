package com.graafik.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.error_magement.BadRequestException;
import com.graafik.model.*;
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
                    throw new BadRequestException("Every shift must have at least one rule. Shift '" + shift.getType() + "' has none.");
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

            
            List<ShiftAlg> shifts = new ArrayList<>();
            for (Shift shift : managedShifts) { shifts.add(ShiftService.toAlg(shift)); }

            ScheduleRequestAlg requestAlg = new ScheduleRequestAlg(managedEmployees, shifts, request.getMonth(), request.getFullTimeMinutes());

            List<ScheduleAlg> schedules = GenerateSchedule.generateSchedule(requestAlg);

            if (schedules == null || schedules.isEmpty()) {
                throw new BadRequestException("Schedule generation failed: no valid schedule produced from input data.");
            }

            ScheduleAlg schedule = schedules.stream()
                .max(Comparator.comparingDouble(ScheduleAlg::getScore))
                .orElse(null);

            saveSchedule(fromAlg(schedule));

            return fromAlg(schedule);
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
            ScheduleRequestAlg scheduleRequest,
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
        if (scheduleRepository.existsById(id)) {
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
            employeeHoursInMinCountingUp,
            employees
        );
    }

    private ScheduleAlg toAlg(Schedule scheduleAlg) {
        ScheduleAlg schedule = new ScheduleAlg();
        schedule.setMonth(scheduleAlg.getMonth());
        schedule.setYear(scheduleAlg.getYear());
        schedule.setScore(scheduleAlg.getScore());
        schedule.setDaySchedules(scheduleAlg.getDaySchedules());
        schedule.setEmployeeHoursInMinutes(scheduleAlg.getEmployeeHoursInMinCountingUp());
        return schedule;
    }

    private Schedule saveSchedule(Schedule schedule) {

        var savedSchedule = scheduleRepository.save(schedule);
        
        if (schedule.getDaySchedules() != null && !schedule.getDaySchedules().isEmpty()) {
            schedule.getDaySchedules().forEach(ds -> {
                if (ds.getScheduleId() == null) {
                    ds.setScheduleId(savedSchedule.getId());
                }

                if (ds.getAssignments() != null && !ds.getAssignments().isEmpty()) {
                    var savedDaySchedule = dayScheduleRepository.save(ds);
                    ds.getAssignments().forEach(sa -> {
                        if (sa.getDayScheduleId() == null) {
                            sa.setDayScheduleId(savedDaySchedule.getId());
                        }
                    });
                    shiftAssignmentRepository.saveAll(ds.getAssignments());
                }

            });
        }
        return savedSchedule;
    }
}
