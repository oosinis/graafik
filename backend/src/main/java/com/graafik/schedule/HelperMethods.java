package com.graafik.schedule;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.graafik.model.Domain.*;
import com.graafik.model.Entities.*;


public class HelperMethods {

    public static List<ShiftAlg> getShiftsForDay(ScheduleRequestAlg scheduleRequest, int date) {

        int dayOfWeekInt = LocalDate.of(2025, scheduleRequest.getMonth(), date + 1).getDayOfWeek().getValue();

        List<ShiftAlg> dayShifts = new ArrayList<>();
        for (ShiftAlg shift : scheduleRequest.getShifts()) {
            for (Rule rule : shift.getRules()) {
                if (!rule.getDaysApplied().contains(dayOfWeekInt)) continue;
                for (int i = 0; i < rule.getPerDay(); i++) {
                    dayShifts.add(shift);
                }
            }
        }

        return dayShifts;
    }   

    // TODO: kontrolli, kas date mis on employeei listis algab nullist
    public static Map<UUID, List<Employee>> getRequestedWorkDays(ScheduleRequestAlg scheduleRequest, int date) {
        Map<UUID, List<Employee>> requestedWorkDays = new HashMap<>();
        for (Employee employee : scheduleRequest.getEmployees()) {
            for (Map.Entry<Integer, UUID> entry : employee.getRequestedWorkDays().entrySet()) {
                if (entry.getKey() != date) continue;
                if (requestedWorkDays.containsKey(entry.getValue())) requestedWorkDays.get(entry.getValue()).add(employee);
                else requestedWorkDays.put(entry.getValue(), new ArrayList<>(Arrays.asList(employee)));
            }
        }
        return requestedWorkDays;
    }  

    public static void initEmployeeHoursInMinutes(ScheduleAlg currentSchedule, ScheduleRequestAlg scheduleRequest) {
        currentSchedule.setEmployeeHoursInMinutes(new HashMap<>());
        for (Employee employee : scheduleRequest.getEmployees()) {
            currentSchedule.getEmployeeHoursInMinutes().put(employee.getId(), (long) (employee.getWorkLoad() * scheduleRequest.getFullTimeMinutes() * 60));
        }
    }

    public static void addToEmployeeHours(ScheduleAlg currentSchedule, DayScheduleAlg currentDayShiftAssignments) {
        for (ShiftAssignmentAlg shiftAssignment : currentDayShiftAssignments.getAlgAssignments()) {
            //System.out.println("ADD: " + shiftAssignment.getShift().getDuration() + ", " + shiftAssignment.getemployee().getId());
            currentSchedule.changeEmployeeHours(shiftAssignment.getShiftAlg().getDurationInMinutes(), shiftAssignment.getEmployee().getId());
        }
    }

    public static void substractFromEmployeeHours(ScheduleAlg currentSchedule, DayScheduleAlg currentDayShiftAssignments) {
        for (ShiftAssignmentAlg shiftAssignment : currentDayShiftAssignments.getAlgAssignments()) {
            //System.out.println("SUBSTRACT: " + shiftAssignment.getShift().getDuration() + ", " + shiftAssignment.getemployee().getId());

            currentSchedule.changeEmployeeHours(-shiftAssignment.getShiftAlg().getDurationInMinutes(), shiftAssignment.getEmployee().getId());
        }
    }


    // ClONING
    public static ScheduleAlg cloneSchedule(ScheduleAlg original) {
    ScheduleAlg cloned = new ScheduleAlg();
    cloned.setMonth(original.getMonth());
    cloned.setYear(original.getYear());
    cloned.setScore(original.getScore());
    cloned.setFullTimeMinutes(original.getFullTimeMinutes());
    cloned.setEmployeeHoursInMinutes(new HashMap<>(original.getEmployeeHoursInMinutes()));

    if (original.getAlgDaySchedules() != null) {
        List<DayScheduleAlg> clonedDaySchedules = new ArrayList<>();
        for (DayScheduleAlg daySchedule : original.getAlgDaySchedules()) {
            clonedDaySchedules.add(cloneDaySchedule(daySchedule));
        }
        cloned.setAlgDaySchedules(clonedDaySchedules);
    }

    return cloned;
    }

    public static DayScheduleAlg cloneDaySchedule(DayScheduleAlg original) {
        DayScheduleAlg cloned = new DayScheduleAlg(original.getDayOfMonth(), new ArrayList<>());

        for (ShiftAssignmentAlg assignment : original.getAlgAssignments()) {
            cloned.getAlgAssignments().add(new ShiftAssignmentAlg(assignment.getShiftAlg(), assignment.getEmployee()));
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
    public static void permuteHelper(ScheduleRequestAlg scheduleRequest, List<ShiftAlg> currentDayShifts, Map<UUID, List<Employee>> currentRequestedWorkDays, DayScheduleAlg currentDaySchedule, List<DayScheduleAlg> allDaySchedulePermutations, int date) {

        // if all shifts have a employee assigned for them, return
        if (currentDaySchedule.getAlgAssignments().size() == currentDayShifts.size()) {
            DayScheduleAlg clonedDaySchedule = HelperMethods.cloneDaySchedule(currentDaySchedule);
            allDaySchedulePermutations.add(clonedDaySchedule);
            return;
        }

        for (Employee employee : scheduleRequest.getEmployees()) {

            // skip vacation days
            // +1 bc the dates start from 1
            if (employee.getVacationDays().contains(date + 1)) continue;
            if (employee.getSickDays().contains(date + 1)) continue;

            ShiftAlg shift = (currentDayShifts.get(currentDaySchedule.getAlgAssignments().size()));

            if (!RuleValidator.initialValidator(currentRequestedWorkDays, shift, employee)) continue;

            ShiftAssignmentAlg shiftAssignment = new ShiftAssignmentAlg(shift, employee);

            if (DayScheduleAlg.containsEmployee(currentDaySchedule, employee) == null) {
                currentDaySchedule.getAlgAssignments().add(shiftAssignment);
                permuteHelper(scheduleRequest, currentDayShifts, currentRequestedWorkDays, currentDaySchedule, allDaySchedulePermutations, date);
                currentDaySchedule.getAlgAssignments().removeLast();
            
            }

        }
    }
    
    
}
