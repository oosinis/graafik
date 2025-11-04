package com.graafik.schedule;

import java.io.File;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.DaySchedule;
import com.graafik.model.ScheduleAlg;
import com.graafik.model.ScheduleRequestAlg;
import com.graafik.model.ShiftAlg;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;

public class GenerateSchedule {
    public static void main(String[] args) {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            File jsonFile = new File("backend/src/main/java/com/graafik/data/db/schedulerequest.json");
            List<ScheduleRequestAlg> requests = objectMapper.readValue(jsonFile, 
            objectMapper.getTypeFactory().constructCollectionType(List.class, ScheduleRequestAlg.class));

            generateSchedule(requests.getFirst());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 
     * @param scheduleRequest
     * @return
     */
    public static List<ScheduleAlg> generateSchedule(ScheduleRequestAlg scheduleRequest) {

        for (ShiftAlg shift : scheduleRequest.getShifts()) {
            System.out.println(shift.getType() + ": " + shift.getDurationInMinutes());
        }

        List<ScheduleAlg> allPossibleSchedules = generateAllPossibleSchedules(scheduleRequest);

        System.out.println("ALL SCHEDULES:");
        //printSchedules(allPossibleSchedules);
            
        return allPossibleSchedules;

    }

    /**
     * 
     * @param scheduleRequest
     * @return
     */
    public static List<ScheduleAlg> generateAllPossibleSchedules(ScheduleRequestAlg scheduleRequest) {

        // get a list of shifts for every day of the month

        List<ScheduleAlg> allCombinations = new ArrayList<>();

        ScheduleAlg schedule = new ScheduleAlg();

        schedule.setMonth(scheduleRequest.getMonth());
        // TODO change to automatic
        schedule.setYear(2025);
        // for generating all durations are in minutes
        schedule.setFullTimeMinutes(scheduleRequest.getFullTimeMinutes()* 60);

        HelperMethods.initWorkerHoursInMinutes(schedule, scheduleRequest);

        // Recursively generate all combinations
        generateCombinationsRecursive(scheduleRequest, 0, schedule, allCombinations);

        return allCombinations;

    }

    /**
     * 
     * @param scheduleRequest
     * @param date
     * @param currentSchedule
     * @param allCombinations
     */
    private static void generateCombinationsRecursive(ScheduleRequestAlg scheduleRequest, int date,
                                                      ScheduleAlg currentSchedule, List<ScheduleAlg> allCombinations) {

        int daysInMonth = YearMonth.of(2025, currentSchedule.getMonth()).lengthOfMonth();

        if (date == daysInMonth) {
            // All days processed, add the combination
            ScheduleAlg clonedSchedule = HelperMethods.cloneSchedule(currentSchedule);

            allCombinations.add(clonedSchedule);
            return;
        }

        // Generate currentDayAllPossibleShiftAssignments of workers for the current shift count
        List<DaySchedule> currentDayAllPossibleShiftAssignments = getPermutations(scheduleRequest, date);

        // go through all the generated possible assignments for the current date
        for (DaySchedule currentDayShiftAssignments : currentDayAllPossibleShiftAssignments) {

            int currentScore = currentSchedule.getScore() + RuleValidator.dayAssignmentsValidator(scheduleRequest, currentSchedule, currentDayShiftAssignments);
            if (currentScore < -50) continue;

            if (currentSchedule.getDaySchedules() == null) {
                // kui schedule alles tühi
                currentSchedule.setDaySchedules(new ArrayList<>(List.of(currentDayShiftAssignments)));
                
            } 
            else {
                // kui juba schedulis midagi olems
                currentSchedule.getDaySchedules().add(currentDayShiftAssignments);
            }

            HelperMethods.substractFromWorkerHours(currentSchedule, currentDayShiftAssignments);

            currentSchedule.setScore(currentScore);
            
            // rn to not wait for all possibilities
            // TODO get all and choose the best ones
            //if (allCombinations.size() == 3) break;

            // if rating is fine go to next date do the whole thing again
            generateCombinationsRecursive(scheduleRequest, date + 1, currentSchedule, allCombinations);

            // recursion done, remove last assignments list that was added and try with the next one
            DaySchedule lastDaySchedule = currentSchedule.getDaySchedules().removeLast();
            HelperMethods.addToWorkerHours(currentSchedule, lastDaySchedule);
            currentSchedule.addToScore(- lastDaySchedule.getScore());
        }
    }

    /**
     * 
     * @param scheduleRequest
     * @param date
     * @return
     */
    public static List<DaySchedule> getPermutations(ScheduleRequestAlg scheduleRequest, int date) {
        List<DaySchedule> allDaySchedulePermutations = new ArrayList<>();

        List<ShiftAlg> currentDayShifts = HelperMethods.getShiftsForDay(scheduleRequest, date);
        Map<UUID, List<Worker>> currentRequestedWorkDays = HelperMethods.getRequestedWorkDays(scheduleRequest, date);

        HelperMethods.permuteHelper(scheduleRequest, currentDayShifts, currentRequestedWorkDays, new DaySchedule(date, new ArrayList<>()), allDaySchedulePermutations, date);
        return allDaySchedulePermutations;
    }

    
    
    public static void printSchedules(List<ScheduleAlg> schedules) {
        for (ScheduleAlg combination : schedules) {
            System.out.println("\n NEW SCHEDULE score: " + combination.getScore());
            int x  = 1;
            for (DaySchedule day : combination.getDaySchedules()) {
                System.out.print(x + ": ");
                for (ShiftAssignment ShiftAssignment : day.getAssignments()) {
                    System.out.print(ShiftAssignment.getWorker().getName() +  ", " + ShiftAssignment.getShift().getType() +"; ");
                }
                x++;
                System.out.println();
            }

            System.out.println();
            combination.getWorkerHoursInMinutes().forEach((worker, hours) -> {
                System.out.println("worker: " + worker + ": " + hours);
            });
            
            System.out.println();
            System.out.println("---");
        }
    }

}