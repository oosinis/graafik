package com.graafik.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.graafik.model.DaySchedule;
import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;

public class HelperMethods {

    public static List<Shift> getShiftsForDay(ScheduleRequest scheduleRequest, int date) {

        int dayOfWeekInt = LocalDate.of(2025, scheduleRequest.getMonth(), date + 1).getDayOfWeek().getValue();


        List<Shift> dayShifts = new ArrayList<>();
        for (Shift shift : scheduleRequest.getShifts()) {
            for (Rule rule : shift.getRules()) {
                if (!rule.getDaysApplied().contains(dayOfWeekInt)) continue;
                for (int i = 0; i < rule.getPerDay(); i++) {
                    dayShifts.add(shift);
                }
            }
        }

        return dayShifts;
    }   


    // ClONING
    public static Schedule cloneSchedule(Schedule original) {
    Schedule cloned = new Schedule();
    cloned.setMonth(original.getMonth());
    cloned.setYear(original.getYear());

    if (original.getDaySchedules() != null) {
        List<DaySchedule> clonedDaySchedules = new ArrayList<>();
        for (DaySchedule daySchedule : original.getDaySchedules()) {
            clonedDaySchedules.add(cloneDaySchedule(daySchedule));
        }
        cloned.setDaySchedules(clonedDaySchedules);
    }

    return cloned;
    }

    public static DaySchedule cloneDaySchedule(DaySchedule original) {
        DaySchedule cloned = new DaySchedule(original.getDayOfMonth(), new ArrayList<>());

        for (ShiftAssignment assignment : original.getAssignments()) {
            cloned.getAssignments().add(new ShiftAssignment(assignment.getShift(), assignment.getWorker()));
        }

        return cloned;
    }
    
}
