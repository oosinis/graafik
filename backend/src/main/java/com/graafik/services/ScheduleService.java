package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Worker;
import com.graafik.repositories.ScheduleRepository;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.schedule.RegenerateExistingSchedule;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Schedule createSchedule(ScheduleRequest request) {
        return GenerateSchedule.generateSchedule(request).get(0);
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
