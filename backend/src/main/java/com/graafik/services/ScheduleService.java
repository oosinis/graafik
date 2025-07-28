package com.graafik.services;
import java.util.List;

import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.schedule.GenerateSchedule;



public class ScheduleService {
    private UserRepository userRepository;
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
            userRepository.save(schedule)
        }
        System.out.println("VALMIS");
        if (schedules.size() > 0) return schedules.get(0);
        else return new Schedule();
    }
}