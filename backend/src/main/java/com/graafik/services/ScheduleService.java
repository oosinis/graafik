package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.dto.ScheduleDTO;
import com.graafik.model.DaySchedule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.Worker;
import com.graafik.repositories.ScheduleRepository;
import com.graafik.repositories.ShiftAssignmentRepository;
import com.graafik.repositories.DayScheduleRepository;
import com.graafik.repositories.ShiftRepository;
import com.graafik.repositories.WorkerRepository;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.schedule.RegenerateExistingSchedule;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ShiftRepository shiftRepository;
    private final WorkerRepository workerRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;


    public ScheduleService(ScheduleRepository scheduleRepository, 
                        ShiftRepository shiftRepository, 
                        WorkerRepository workerRepository,
                        DayScheduleRepository dayScheduleRepository,
                        ShiftAssignmentRepository shiftAssignmentRepository) {
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.workerRepository = workerRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    @Transactional
    public ScheduleDTO createSchedule(ScheduleRequest request) {
        
        List<Shift> managedShifts = request.getShifts().stream()
                .map(shiftRepository::save)
                .toList();
        request.setShifts(managedShifts);

        List<Worker> managedWorkers = request.getWorkers().stream()
                .map(workerRepository::save)
                .toList();
        request.setWorkers(managedWorkers);

        List<Schedule> schedules = GenerateSchedule.generateSchedule(request);
        if (schedules.isEmpty()) return null;

        var schedule = schedules.get(0);
        saveSchedule(schedule);

        return toDTO(schedule);
    }

    @Transactional
    public List<ScheduleDTO> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public Optional<ScheduleDTO> getScheduleById(UUID id) {
        return scheduleRepository.findById(id).map(this::toDTO);
    }

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

        if (schedules == null || schedules.isEmpty()) return Optional.empty();

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
        return new ScheduleDTO(
            schedule.getId(),
            schedule.getMonth(),
            schedule.getYear(),
            schedule.getScore(),
            schedule.getDaySchedules(),
            schedule.getWorkerHours()
        );
    }

    private Schedule fromDTO(ScheduleDTO dto, List<DaySchedule> daySchedules) {
        Schedule schedule = new Schedule();
        schedule.setMonth(dto.getMonth());
        schedule.setYear(dto.getYear());
        schedule.setScore(dto.getScore());
        schedule.setDaySchedules(daySchedules);
        schedule.setWorkerHours(dto.getWorkerHours());
        return schedule;
    }

    private Schedule saveSchedule(Schedule schedule) {

        var savedSchedule = scheduleRepository.save(schedule);
        
        if (schedule.getDaySchedules() != null && !schedule.getDaySchedules().isEmpty()) {
            schedule.getDaySchedules().forEach(ds -> {
                if (ds.getScheduleId() == null) {
                    ds.setScheduleId(savedSchedule.getId());
                }

                var savedDaySchedule = dayScheduleRepository.save(ds);

                if (ds.getAssignments() != null && !ds.getAssignments().isEmpty()) {
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
