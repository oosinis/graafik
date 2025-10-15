package com.graafik.services;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.dto.ScheduleDTO;
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
    private final WorkerRepository workerRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;


    public ScheduleService(ScheduleRepository scheduleRepository, 
                        ShiftService shiftService, 
                        WorkerRepository workerRepository,
                        DayScheduleRepository dayScheduleRepository,
                        ShiftAssignmentRepository shiftAssignmentRepository) {
        this.scheduleRepository = scheduleRepository;
        this.shiftService = shiftService;
        this.workerRepository = workerRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    @Transactional
    public ScheduleDTO createSchedule(ScheduleRequest request) {
        try {

            if (request.getShifts() == null || request.getShifts().isEmpty()) {
                throw new BadRequestException("No shifts provided for schedule creation.");
            }

            for (Shift shift : request.getShifts()) {
                System.out.println("SHIFT: " + shift.getDuration());
                if (shift.getRules() == null || shift.getRules().isEmpty()) {
                    throw new BadRequestException("Every shift must have at least one rule. Shift '" + shift.getType() + "' has none.");
                }
            }

            if (request.getWorkers() == null || request.getWorkers().isEmpty()) {
                throw new BadRequestException("No workers provided for schedule creation.");
            }

            List<Shift> managedShifts = request.getShifts().stream()
                .map(shift -> {
                    Shift saved = shiftService.saveShift(shift);
                    return saved;
                })
                .toList();
            request.setShifts(managedShifts);

            List<Worker> managedWorkers = request.getWorkers().stream()
                .map(workerRepository::save)
                .toList();
            request.setWorkers(managedWorkers);


            List<Schedule> schedules = GenerateSchedule.generateSchedule(request);

            if (schedules == null || schedules.isEmpty()) {
                throw new BadRequestException("Schedule generation failed: no valid schedule produced from input data.");
            }

            Schedule schedule = schedules.stream()
                .max(Comparator.comparingDouble(Schedule::getScore))
                .orElse(null);

            saveSchedule(schedule);

            return toDTO(schedule);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Unexpected error during schedule creation: " + e.getMessage());
        }
    }



    @Transactional
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public Optional<ScheduleDTO> getScheduleById(UUID scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .map(schedule -> {
                    List<DaySchedule> daySchedules = dayScheduleRepository.findByScheduleId(scheduleId);
                    daySchedules.forEach(ds -> {
                        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByDayScheduleId(ds.getId());
                        ds.setAssignments(assignments);
                    });
                    schedule.setDaySchedules(daySchedules);
                    return toDTO(schedule);
                });
    }

    @Transactional
    public Optional<ScheduleDTO> getLatestScheduleByMonthAndYear(int month, int year) {
        return scheduleRepository.findFirstByMonthAndYearOrderByCreatedAtDesc(month, year)
                .map(schedule -> {
                    List<DaySchedule> daySchedules = dayScheduleRepository.findByScheduleId(schedule.getId());
                    daySchedules.forEach(ds -> {
                        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByDayScheduleId(ds.getId());
                        ds.setAssignments(assignments);
                    });
                    schedule.setDaySchedules(daySchedules);
                    return toDTO(schedule);
                });
    }

    // TODO
    // rn saves the new schedule by default
    // should display multiple schedules to the user save the one they choose
    public Optional<ScheduleDTO> updateSchedule(
            ScheduleRequest scheduleRequest,
            UUID scheduleId,
            int startDate,
            int endDate,
            Worker missingWorker
    ) {
        Optional<Schedule> currentScheduleOpt = scheduleRepository.findById(scheduleId);
        if (currentScheduleOpt.isEmpty()) return Optional.empty();

        Schedule currentSchedule = currentScheduleOpt.get();

        List<Schedule> schedules = RegenerateExistingSchedule.regenerateSchedule(
                scheduleRequest,
                currentSchedule,
                startDate,
                endDate,
                missingWorker
        );

        if (schedules == null || schedules.isEmpty()) {
            throw new BadRequestException("Failed to regenerate schedule for given date range.");
        }


        Schedule saved = scheduleRepository.save(schedules.get(0));
        return Optional.of(toDTO(saved));
    }


    public boolean deleteSchedule(UUID id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ScheduleDTO toDTO(Schedule schedule) {
        // Get all workers referenced in workerHours
        // Tuleb muuta see halb lahendus
        List<Worker> workers = schedule.getWorkerHoursInMinutes().keySet().stream()
            .map(workerId -> workerRepository.findById(workerId).orElse(null))
            .filter(worker -> worker != null)
            .toList();

        return new ScheduleDTO(
            schedule.getId(),
            schedule.getMonth(),
            schedule.getYear(),
            schedule.getScore(),
            schedule.getDaySchedules(),
            schedule.getWorkerHoursInMinutes(),
            workers
        );
    }

    private Schedule fromDTO(ScheduleDTO dto, List<DaySchedule> daySchedules) {
        Schedule schedule = new Schedule();
        schedule.setMonth(dto.getMonth());
        schedule.setYear(dto.getYear());
        schedule.setScore(dto.getScore());
        schedule.setDaySchedules(daySchedules);
        schedule.setWorkerHoursInMinutes(dto.getWorkerHours());
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
