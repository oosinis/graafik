package com.graafik.schedule;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import java.io.File;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.graafik.data.WorkerConverter;
import com.graafik.model.DaySchedule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;

public class CreateSchedule {
    public static void main(String[] args) {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
        File jsonFile = new File("backend/src/main/java/com/graafik/data/db/schedulerequest.json");
        ScheduleRequest request = objectMapper.readValue(jsonFile, objectMapper.getTypeFactory().constructCollectionType(List.class, Shift.class));
        
        createSchedule(request);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void createSchedule(ScheduleRequest scheduleRequest) {

        List<Schedule> allPossibleSchedules = generateAllPossibleSchedules(scheduleRequest);

        // Print the results
        for (Schedule combination : allPossibleSchedules) {
            for (DaySchedule day : combination.getDaySchedules()) {
                for (ShiftAssignment ShiftAssignment : day.getAssignments()) {
                    System.out.print(ShiftAssignment.getWorker() +  " " + ShiftAssignment.getShift() +", ");
                }
                System.out.println();
            }
            System.out.println("---");
        }

    }

    public static List<Schedule> generateAllPossibleSchedules(ScheduleRequest scheduleRequest) {

        // get a list of shifts for every day of the month

        List<Schedule> allCombinations = new ArrayList<>();

        // Recursively generate all combinations
        generateCombinationsRecursive(scheduleRequest, 0, new Schedule(), allCombinations);

        return allCombinations;

    }

    private static void generateCombinationsRecursive(ScheduleRequest scheduleRequest, int date,
                                                      Schedule currentSchedule, List<Schedule> allCombinations) {

        int daysInMonth = YearMonth.of(scheduleRequest.getYear(), scheduleRequest.getMonth()).lengthOfMonth();

        if (date == daysInMonth) {
            // All days processed, add the combination
            allCombinations.add(currentSchedule);
            return;
        }

        // Generate currentDayAllPossibleShiftAssignments of workers for the current shift count
        List<DaySchedule> currentDayAllPossibleShiftAssignments = getPermutations(scheduleRequest, date);

        // go through all the generated possible assignments for the current date
        for (DaySchedule currentDayShiftAssignments : currentDayAllPossibleShiftAssignments) {

            //if (validator(currentSchedule, currentDayShiftAssignments) < -50) continue;

            currentSchedule.getDaySchedules().add(currentDayShiftAssignments);

            // rn to not wait for all possibilities
            if (allCombinations.size() == 3) break;

            // if rating is fine go to next date do the whole thing again
            generateCombinationsRecursive(scheduleRequest, date + 1, currentSchedule, allCombinations);

            // recursion done, remove last assignments list that was added and try with the next one
            currentSchedule.getDaySchedules().removeLast();
        }
    }

    public static List<DaySchedule> getPermutations(ScheduleRequest scheduleRequest, int date) {
        List<DaySchedule> allDaySchedulePermutations = new ArrayList<>();

        List<Shift> currentDayShifts = getCurrentDayShifts(scheduleRequest, date);

        permuteHelper(scheduleRequest, currentDayShifts, new DaySchedule(date, new ArrayList<>()), allDaySchedulePermutations);
        return allDaySchedulePermutations;
    }

    private static void permuteHelper(ScheduleRequest scheduleRequest, List<Shift> currentDayShifts, DaySchedule currentDaySchedule, List<DaySchedule> allDaySchedulePermutations) {

        // if all shifts have a worker assigned for them, return
        if (currentDaySchedule.getAssignments().size() == currentDayShifts.size()) {
            allDaySchedulePermutations.add(currentDaySchedule);
            return;
        }

        for (Worker worker : scheduleRequest.getWorkers()) {
            ShiftAssignment ShiftAssignment = new ShiftAssignment((currentDayShifts.get(currentDaySchedule.getAssignments().size())), worker);
            if (!containsWorker(currentDaySchedule, worker)) {
                currentDaySchedule.getAssignments().add(ShiftAssignment);
                permuteHelper(scheduleRequest, currentDayShifts, currentDaySchedule, allDaySchedulePermutations);
                currentDaySchedule.getAssignments().removeLast();
            }

        }
    }

    // TODO: korda see genemine, või mõelda kuidas struktuur olla võiks
    public static List<Shift> getCurrentDayShifts(ScheduleRequest scheduleRequest, int date) {
        List<Shift> shifts = new ArrayList<>();
        shifts.add(new Shift("Shift.OSAKOND", 24, new ArrayList<>()));
        shifts.add(new Shift("Shift.INTENSIIV", 24, new ArrayList<>()));
        shifts.add(new Shift("Shift.OSAKOND", 8, new ArrayList<>()));

        return shifts;
    }

    // TODO
    public static int validator(List<List<ShiftAssignment>> currentSchedule, List<ShiftAssignment> currentDayShiftAssignments) {
        for (ShiftAssignment ShiftAssignment : currentDayShiftAssignments) {
            ShiftAssignment.getShift();
        }
        return 0;
    }

    public static boolean containsWorker(DaySchedule ShiftAssignments, Worker worker) {
        for (ShiftAssignment ShiftAssignment : ShiftAssignments.getAssignments()) {
            if (ShiftAssignment.getWorker().equals(worker)) {
                return true;
            }
        }
        return false;
    }
}