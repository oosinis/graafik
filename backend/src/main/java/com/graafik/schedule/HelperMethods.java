package com.graafik.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


import com.graafik.model.DaySchedule;
import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;


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
    public static Map<UUID, List<Worker>> getRequestedWorkDays(ScheduleRequest scheduleRequest, int date) {
        Map<UUID, List<Worker>> requestedWorkDays = new HashMap<>();
        for (Worker worker : scheduleRequest.getWorkers()) {
            for (Map.Entry<Integer, UUID> entry : worker.getRequestedWorkDays().entrySet()) {
                if (entry.getKey() != date) continue;
                if (requestedWorkDays.containsKey(entry.getValue())) requestedWorkDays.get(entry.getValue()).add(worker);
                else requestedWorkDays.put(entry.getValue(), new ArrayList<>(Arrays.asList(worker)));
            }
        }
        return requestedWorkDays;
    }  

    public static void initWorkerHoursInMinutes(Schedule currentSchedule, ScheduleRequest scheduleRequest) {
        currentSchedule.setWorkerHoursInMinutes(new HashMap<>());
        for (Worker worker : scheduleRequest.getWorkers()) {
            currentSchedule.getWorkerHoursInMinutes().put(worker.getId(), (int) (worker.getWorkLoad() * scheduleRequest.getFullTimeHours() * 60));
        }
    }

    public static void addToWorkerHours(Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments()) {
            //System.out.println("ADD: " + shiftAssignment.getShift().getDuration() + ", " + shiftAssignment.getWorker().getId());
            currentSchedule.changeWorkerHours(shiftAssignment.getShift().getDurationInMinutes(), shiftAssignment.getWorker().getId());
        }
    }

    public static void substractFromWorkerHours(Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments()) {
            //System.out.println("SUBSTRACT: " + shiftAssignment.getShift().getDuration() + ", " + shiftAssignment.getWorker().getId());

            currentSchedule.changeWorkerHours(-shiftAssignment.getShift().getDurationInMinutes(), shiftAssignment.getWorker().getId());
        }
    }


    // ClONING
    public static Schedule cloneSchedule(Schedule original) {
    Schedule cloned = new Schedule();
    cloned.setMonth(original.getMonth());
    cloned.setYear(original.getYear());
    cloned.setScore(original.getScore());
    cloned.setWorkerHoursInMinutes(new HashMap<>(original.getWorkerHoursInMinutes()));

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

    /**
     * 
     * @param scheduleRequest
     * @param currentDayShifts
     * @param currentRequestedWorkDays
     * @param currentDaySchedule
     * @param allDaySchedulePermutations
     * @param date
     */
    public static void permuteHelper(ScheduleRequest scheduleRequest, List<Shift> currentDayShifts, Map<UUID, List<Worker>> currentRequestedWorkDays, DaySchedule currentDaySchedule, List<DaySchedule> allDaySchedulePermutations, int date) {

        // if all shifts have a worker assigned for them, return
        if (currentDaySchedule.getAssignments().size() == currentDayShifts.size()) {
            DaySchedule clonedDaySchedule = HelperMethods.cloneDaySchedule(currentDaySchedule);
            allDaySchedulePermutations.add(clonedDaySchedule);
            return;
        }

        for (Worker worker : scheduleRequest.getWorkers()) {

            // skip vacation days
            // +1 bc the dates start from 1
            if (worker.getVacationDays().contains(date + 1)) continue;
            if (worker.getSickDays().contains(date + 1)) continue;

            Shift shift = (currentDayShifts.get(currentDaySchedule.getAssignments().size()));

            if (!RuleValidator.initialValidator(currentRequestedWorkDays, shift, worker)) continue;

            ShiftAssignment ShiftAssignment = new ShiftAssignment(shift, worker);

            if (DaySchedule.containsWorker(currentDaySchedule, worker) == null) {
                currentDaySchedule.getAssignments().add(ShiftAssignment);
                permuteHelper(scheduleRequest, currentDayShifts, currentRequestedWorkDays, currentDaySchedule, allDaySchedulePermutations, date);
                currentDaySchedule.getAssignments().removeLast();
            
            }

        }
    }
    
    
}
