package com.graafik.services;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.schedule.GenerateSchedule;



public class ScheduleService {
    public Schedule Generate(ScheduleRequest scheduleRequest) {
        for (Shift shift : scheduleRequest.getShifts()) {
            System.out.println(shift.toString());
        }
        GenerateSchedule.generateSchedule(scheduleRequest);
        Schedule schedule = new Schedule();
        return schedule;
    }
}