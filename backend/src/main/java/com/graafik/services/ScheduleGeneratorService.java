package com.graafik.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.repositories.ScheduleRepository;
import com.graafik.schedule.GenerateSchedule;

@Service
public class ScheduleGeneratorService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<Schedule> generateAndSaveSchedules(ScheduleRequest scheduleRequest) {
        List<Schedule> schedules = GenerateSchedule.generateSchedule(scheduleRequest);
        for (Schedule schedule : schedules) {
            scheduleRepository.save(schedule);
        }
        return schedules;
    }
    
}
