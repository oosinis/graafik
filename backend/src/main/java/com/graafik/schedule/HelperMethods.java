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
import com.graafik.model.Dtos.*;


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

    // TODO: kontrolli, kas date mis on employeei listis algab nullist
    public static Map<UUID, List<Employee>> getRequestedWorkDays(ScheduleRequest scheduleRequest, int date) {
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

    public static void initEmployeeHoursInMinutes(ScheduleAlg currentSchedule, ScheduleRequest scheduleRequest) {
        currentSchedule.setEmployeeHoursInMinutes(new HashMap<>());
        for (Employee employee : scheduleRequest.getEmployees()) {
            currentSchedule.getEmployeeHoursInMinutes().put(employee.getId(), (long) (employee.getWorkLoad() * scheduleRequest.getFullTimeMinutes() * 60));
        }
    }

    public static void addToEmployeeHours(ScheduleAlg currentSchedule, DaySchedule currentDayShiftAssignments) {
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments()) {
            //System.out.println("ADD: " + shiftAssignment.getShift().getDuration() + ", " + shiftAssignment.getemployee().getId());
            currentSchedule.changeEmployeeHours(shiftAssignment.getShift().getDurationInMinutes(), shiftAssignment.getEmployee().getId());
        }
    }

    public static void substractFromEmployeeHours(ScheduleAlg currentSchedule, DaySchedule currentDayShiftAssignments) {
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments()) {
            //System.out.println("SUBSTRACT: " + shiftAssignment.getShift().getDuration() + ", " + shiftAssignment.getemployee().getId());

            currentSchedule.changeEmployeeHours(-shiftAssignment.getShift().getDurationInMinutes(), shiftAssignment.getEmployee().getId());
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
            cloned.getAssignments().add(new ShiftAssignment(assignment.getShift(), assignment.getEmployee()));
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
    public static void permuteHelper(ScheduleRequest scheduleRequest, List<Shift> currentDayShifts, Map<UUID, List<Employee>> currentRequestedWorkDays, DaySchedule currentDaySchedule, List<DaySchedule> allDaySchedulePermutations, int date) {

        // if all shifts have a employee assigned for them, return
        if (currentDaySchedule.getAssignments().size() == currentDayShifts.size()) {
            DaySchedule clonedDaySchedule = HelperMethods.cloneDaySchedule(currentDaySchedule);
            allDaySchedulePermutations.add(clonedDaySchedule);
            return;
        }

        for (Employee employee : scheduleRequest.getEmployees()) {

            // skip vacation days
            // +1 bc the dates start from 1
            if (employee.getVacationDays().contains(date + 1)) continue;
            if (employee.getSickDays().contains(date + 1)) continue;

            Shift shift = (currentDayShifts.get(currentDaySchedule.getAssignments().size()));

            if (!RuleValidator.initialValidator(currentRequestedWorkDays, shift, employee)) continue;

            ShiftAssignment shiftAssignment = new ShiftAssignment(shift, employee);

            if (DaySchedule.containsEmployee(currentDaySchedule, employee) == null) {
                currentDaySchedule.getAssignments().add(shiftAssignment);
                permuteHelper(scheduleRequest, currentDayShifts, currentRequestedWorkDays, currentDaySchedule, allDaySchedulePermutations, date);
                currentDaySchedule.getAssignments().removeLast();
            
            }

        }
    }
    
    
}
