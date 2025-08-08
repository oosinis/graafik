package com.graafik.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.graafik.model.DaySchedule;
import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.WorkerDto;


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

    // TODO: kontrolli, kas date mis on workeri listis algab nullist
    public static Map<Shift, List<WorkerDto>> getRequestedWorkDays(ScheduleRequest scheduleRequest, int date) {
        Map<Shift, List<WorkerDto>> requestedWorkDays = new HashMap<>();
        for (WorkerDto worker : scheduleRequest.getWorkers()) {
            for (Map.Entry<Integer, Shift> entry : worker.getRequestedWorkDays().entrySet()) {
                if (entry.getKey() != date) continue;
                if (requestedWorkDays.containsKey(entry.getValue()))requestedWorkDays.get(entry.getValue()).add(worker);
                else requestedWorkDays.put(entry.getValue(), new ArrayList<>(Arrays.asList(worker)));
            }
        }
        return requestedWorkDays;
    }  

    public static void initWorkerHours(Schedule currentSchedule, ScheduleRequest scheduleRequest) {
        currentSchedule.setWorkerHours(new HashMap<>());
        for (WorkerDto worker : scheduleRequest.getWorkers()) {
            currentSchedule.getWorkerHours().put(worker, (int) (worker.getWorkLoad() * scheduleRequest.getFullTimeHours()));
        }
    }

    public static void addToWorkerHours(Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments()) {
            currentSchedule.changeWorkerHours(shiftAssignment.getShift().getDuration(), shiftAssignment.getWorker());
        }
    }

    public static void substractFromWorkerHours(Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments()) {
            currentSchedule.changeWorkerHours(-shiftAssignment.getShift().getDuration(), shiftAssignment.getWorker());
        }
    }


    // ClONING
    public static Schedule cloneSchedule(Schedule original) {
    Schedule cloned = new Schedule();
    cloned.setMonth(original.getMonth());
    cloned.setYear(original.getYear());
    cloned.setScore(original.getScore());
    cloned.setWorkerHours(new HashMap<>(original.getWorkerHours()));

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
