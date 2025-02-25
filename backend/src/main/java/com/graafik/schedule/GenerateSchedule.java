package com.graafik.schedule;

import java.io.File;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.DaySchedule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.WorkerDto;

public class GenerateSchedule {
    public static void main(String[] args) {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            File jsonFile = new File("backend/src/main/java/com/graafik/data/db/schedulerequest.json");
            List<ScheduleRequest> requests = objectMapper.readValue(jsonFile, 
            objectMapper.getTypeFactory().constructCollectionType(List.class, ScheduleRequest.class));

            // Now pass the requests list to the createSchedule method
            generateSchedule(requests.getFirst());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Schedule generateSchedule(com.graafik.model.ScheduleRequest scheduleRequest) {

        List<Schedule> allPossibleSchedules = generateAllPossibleSchedules(scheduleRequest);

        
        // Print the results
        for (Schedule combination : allPossibleSchedules) {
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
            combination.getWorkerHours().forEach((worker, hours) -> {
                System.out.println(worker + ": " + hours);
            });
            System.out.println();

            System.out.println("---");
        }
            
        return new Schedule();

    }

    public static List<Schedule> generateAllPossibleSchedules(ScheduleRequest scheduleRequest) {

        // get a list of shifts for every day of the month

        List<Schedule> allCombinations = new ArrayList<>();

        Schedule schedule = new Schedule();

        HelperMethods.initWorkerHours(schedule, scheduleRequest);

        // Recursively generate all combinations
        generateCombinationsRecursive(scheduleRequest, 0, schedule, allCombinations);

        return allCombinations;

    }

    private static void generateCombinationsRecursive(ScheduleRequest scheduleRequest, int date,
                                                      Schedule currentSchedule, List<Schedule> allCombinations) {

        int daysInMonth = 5; //YearMonth.of(2025, scheduleRequest.getMonth()).lengthOfMonth();

        if (date == daysInMonth) {
            // All days processed, add the combination
            Schedule clonedSchedule = HelperMethods.cloneSchedule(currentSchedule);
            allCombinations.add(clonedSchedule);
            return;
        }

        // Generate currentDayAllPossibleShiftAssignments of workers for the current shift count
        List<DaySchedule> currentDayAllPossibleShiftAssignments = getPermutations(scheduleRequest, date);

        // go through all the generated possible assignments for the current date
        for (DaySchedule currentDayShiftAssignments : currentDayAllPossibleShiftAssignments) {

            int currentScore = currentSchedule.getScore() + RuleValidator.validator(scheduleRequest, currentSchedule, currentDayShiftAssignments);
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
            
            for (DaySchedule day : currentSchedule.getDaySchedules()) {
                for (ShiftAssignment ShiftAssignment : day.getAssignments()) {
                    //System.out.print(ShiftAssignment.getWorker().getName() +  " " + ShiftAssignment.getShift().getType() +", ");
                }
                //System.out.println();
            }
            //System.out.println("---");
            
            // rn to not wait for all possibilities
            if (allCombinations.size() == 1) break;

            // if rating is fine go to next date do the whole thing again
            generateCombinationsRecursive(scheduleRequest, date + 1, currentSchedule, allCombinations);

            // recursion done, remove last assignments list that was added and try with the next one
            DaySchedule lastDaySchedule = currentSchedule.getDaySchedules().removeLast();
            HelperMethods.addToWorkerHours(currentSchedule, lastDaySchedule);
            currentSchedule.addToScore(- lastDaySchedule.getScore());
        }
    }

    public static List<DaySchedule> getPermutations(ScheduleRequest scheduleRequest, int date) {
        List<DaySchedule> allDaySchedulePermutations = new ArrayList<>();

        List<Shift> currentDayShifts = HelperMethods.getShiftsForDay(scheduleRequest, date);
        Map<Shift, List<WorkerDto>> currentRequestedWorkDays = HelperMethods.getRequestedWorkDays(scheduleRequest, date);

        permuteHelper(scheduleRequest, currentDayShifts, currentRequestedWorkDays, new DaySchedule(date, new ArrayList<>()), allDaySchedulePermutations, date);
        return allDaySchedulePermutations;
    }

    private static void permuteHelper(ScheduleRequest scheduleRequest, List<Shift> currentDayShifts, Map<Shift, List<WorkerDto>> currentRequestedWorkDays, DaySchedule currentDaySchedule, List<DaySchedule> allDaySchedulePermutations, int date) {

        // if all shifts have a worker assigned for them, return
        if (currentDaySchedule.getAssignments().size() == currentDayShifts.size()) {
            DaySchedule clonedDaySchedule = HelperMethods.cloneDaySchedule(currentDaySchedule);
            allDaySchedulePermutations.add(clonedDaySchedule);
            return;
        }

        for (WorkerDto worker : scheduleRequest.getWorkers()) {

            // skip vacation days
            if (worker.getVacationDays().contains(date)) continue;

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