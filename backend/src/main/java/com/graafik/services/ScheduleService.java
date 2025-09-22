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

    public ScheduleService(ScheduleRepository scheduleRepository, 
                        ShiftRepository shiftRepository, 
                        WorkerRepository workerRepository) {
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.workerRepository = workerRepository;
    }

    @Transactional
    public Schedule createSchedule(ScheduleRequest request) {
        
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

        Schedule schedule = schedules.get(0);

        return schedule;
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
            schedule.getDaySchedules().stream().map(DaySchedule::getId).toList(),
            schedule.getWorkerHours()
        );
    }

    private Schedule fromDTO(ScheduleDTO dto, List<DaySchedule> daySchedules) {
        Schedule schedule = new Schedule();
        schedule.setMonth(dto.getMonth());
        schedule.setYear(dto.getYear());
        schedule.setScore(dto.getScore());
        schedule.setDaySchedules(daySchedules);
        schedule.setDayScheduleIds(daySchedules.stream().map(DaySchedule::getId).toList());
        schedule.setWorkerHours(dto.getWorkerHours());
        return schedule;
    }
}
