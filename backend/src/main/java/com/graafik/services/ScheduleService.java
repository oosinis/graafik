package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.model.DaySchedule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;
import com.graafik.repositories.ScheduleRepository;
import com.graafik.repositories.WorkerRepository;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.schedule.RegenerateExistingSchedule;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ShiftService shiftService;

    public ScheduleService(ScheduleRepository scheduleRepository, ShiftService shiftService) {
        this.scheduleRepository = scheduleRepository;
        this.shiftService = shiftService;
    }

    public Schedule createSchedule(ScheduleRequest request) {

        List<Shift> savedShifts = shiftService.saveAll(request.getShifts());

        List<Schedule> schedules = GenerateSchedule.generateSchedule(request);
        if (schedules.isEmpty()) return null;

        Schedule schedule = schedules.get(0);

        // ????? idk
        for (DaySchedule day : schedule.getDaySchedules()) {
            for (ShiftAssignment assignment : day.getAssignments()) {
                Shift validShift = savedShifts.stream()
                        .filter(s -> s.getId().equals(assignment.getShift().getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Shift not found"));
                assignment.setShift(validShift);
            }
        }

        return scheduleRepository.save(schedule);
    }

    @Transactional(readOnly = true)
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Schedule> getScheduleById(UUID id) {
        return scheduleRepository.findById(id);
    }

    // rn saves the new schedule by default
    // should display multiple schedules to the user save the one they choose
    public Optional<Schedule> updateSchedule(ScheduleRequest scheduleRequest, Schedule currentSchedule, int startDate, int endDate, Worker missingWorker) {
        List<Schedule> schedules = RegenerateExistingSchedule.regenerateSchedule(scheduleRequest, currentSchedule, startDate, endDate, missingWorker);
        if (schedules == null || schedules.isEmpty()) return Optional.empty();
        Schedule saved = scheduleRepository.save(schedules.get(0));
        return Optional.of(saved);
    }

    public boolean deleteSchedule(UUID id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
