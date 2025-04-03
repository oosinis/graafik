package com.graafik.services;
import java.util.List;

import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.schedule.GenerateSchedule;



public class ScheduleService {
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

        }
        System.out.println("VALMIS");
        return schedules.get(0);
    }
}