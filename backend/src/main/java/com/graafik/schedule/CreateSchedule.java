package com.graafik.schedule;

import com.graafik.data.WorkerConverter;
import com.graafik.model.DaySchedule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;
import com.graafik.model.WorkerDto;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

public class CreateSchedule {
    public static void main(String[] args) {

        ScheduleRequest request = new ScheduleRequest(WorkerConverter.createWorkersList(152), new ArrayList<>(), 2, 2025, 152, new ArrayList<>());
        createSchedule(request);
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

            if (validator(currentSchedule, currentDayShiftAssignments) < -50) continue;

            currentSchedule.add(currentDayShiftAssignments);

            // rn to not wait for all possibilities
            if (allCombinations.size() == 3) break;

            // if rating is fine go to next date do the whole thing again
            generateCombinationsRecursive(scheduleRequest, date + 1, currentSchedule, allCombinations);

            // recursion done, remove last assignments list that was added and try with the next one
            currentSchedule.removeLast();
        }
    }

    public static List<List<ShiftAssignment>> getPermutations(ScheduleRequest scheduleRequest, int date) {
        List<List<ShiftAssignment>> result = new ArrayList<>();

        List<Shift> currentDayShifts = getCurrentDayShifts(scheduleRequest, date);

        permuteHelper(scheduleRequest, currentDayShifts, new DaySchedule(date, new ArrayList<>()), result);
        return result;
    }

    private static void permuteHelper(ScheduleRequest scheduleRequest, List<Shift> currentDayShifts, DaySchedule currentDaySchedule, Schedule result) {

        // if all shifts have a worker assigned for them, return
        if (currentDaySchedule.getAssignments().size() == currentDayShifts.size()) {
            result.getDaySchedules().add(currentDaySchedule);
            return;
        }

        for (WorkerDto worker : scheduleRequest.getWorkers()) {
            ShiftAssignment ShiftAssignment = new ShiftAssignment((currentDayShifts.get(currentDaySchedule.getAssignments().size())), worker);
            if (!containsWorker(currentDaySchedule, worker)) {
                currentDaySchedule.getAssignments().add(ShiftAssignment);
                permuteHelper(scheduleRequest, currentDayShifts, currentDaySchedule, result);
                currentDaySchedule.getAssignments().removeLast();
            }

        }
    }

    // TODO: korda see genemine, või mõelda kuidas struktuur olla võiks
    public static List<Shift> getCurrentDayShifts(ScheduleRequest scheduleRequest, int date) {
        List<Shift> shifts = new ArrayList<>();
        shifts.add(new Shift(24, Shift.OSAKOND));
        shifts.add(new Shift(24, Shift.INTENSIIV));
        shifts.add(new Shift(8, Shift.OSAKOND));

        return shifts;
    }

    // TODO
    public static int validator(List<List<ShiftAssignment>> currentSchedule, List<ShiftAssignment> currentDayShiftAssignments) {
        for (ShiftAssignment ShiftAssignment : currentDayShiftAssignments) {
            ShiftAssignment.getShift();
        }
        return 0;
    }

    public static boolean containsWorker(DaySchedule ShiftAssignments, WorkerDto worker) {
        for (ShiftAssignment ShiftAssignment : ShiftAssignments.getAssignments()) {
            if (ShiftAssignment.getWorker().equals(worker)) {
                return true;
            }
        }
        return false;
    }
}