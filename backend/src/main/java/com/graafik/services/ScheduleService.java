package com.graafik.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.Worker;
import com.graafik.repositories.ScheduleRepository;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.schedule.RegenerateExistingSchedule;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Schedule Generate(ScheduleRequest scheduleRequest) {
        for (Shift shift : scheduleRequest.getShifts()) {
            System.out.println(shift.toString());
            for (Rule rule : shift.getRules()) {
                System.out.println(rule.toString());
            }
        }

        List<Schedule> schedules = GenerateSchedule.generateSchedule(scheduleRequest);
        for (Schedule schedule : schedules) {
            System.out.println(schedule.toString());
            scheduleRepository.save(schedule);
        }
        System.out.println("VALMIS");
        if (!schedules.isEmpty()) return schedules.get(0);
        else return new Schedule();
    }

    public List<Schedule> regenerateSchedule(UUID scheduleId, int startDate, int endDate, Worker missingWorker, ScheduleRequest scheduleRequest) {
        Schedule currentSchedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new RuntimeException("Schedule not found"));

        List<Schedule> newSchedules = RegenerateExistingSchedule.regenerateSchedule(scheduleRequest, currentSchedule, startDate, endDate, missingWorker);

        scheduleRepository.saveAll(newSchedules);

        return newSchedules;
    }
}
