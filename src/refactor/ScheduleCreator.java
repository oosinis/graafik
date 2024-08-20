package refactor;

import data.TöötajateNimekiri;
import java.util.*;
import objects.Shift;
import objects.Worker;

public class ScheduleCreator {

    public static void main(String[] args) {
        TöötajateNimekiri töötajateNimekiriInstance = new TöötajateNimekiri();
        List<Worker> töötajateNimekiri = töötajateNimekiriInstance.getTöötajateNimekiri();

        int daysInMonth = 30;
        String[][] scheduleMatrix = initializeScheduleMatrix(daysInMonth, töötajateNimekiri.size());

        assignWorkerWishes(töötajateNimekiri, scheduleMatrix);
        fillShifts(scheduleMatrix, daysInMonth, töötajateNimekiri);

        printSchedule(scheduleMatrix, töötajateNimekiri);
    }

    // Initialize empty matrix
    private static String[][] initializeScheduleMatrix(int daysInMonth, int numberOfWorkers) {
        String[][] scheduleMatrix = new String[daysInMonth][numberOfWorkers];
        for (int i = 0; i < daysInMonth; i++) {
            Arrays.fill(scheduleMatrix[i], "");
        }
        return scheduleMatrix;
    }

    // Fill in Workers requested days
    private static void assignWorkerWishes(List<Worker> töötajateNimekiri, String[][] scheduleMatrix) {
        for (Worker töötaja : töötajateNimekiri) {
            assignShifts(töötaja, scheduleMatrix);
        }
    }

    // Get day types
    private static void assignShifts(Worker töötaja, String[][] scheduleMatrix) {
        assignSpecificShifts(töötaja.getSooviTööPäevad(), scheduleMatrix, töötaja.getEmployeeId(), "");
        assignSpecificShifts(töötaja.getPuhkusePäevad(), scheduleMatrix, töötaja.getEmployeeId(), "P");
        assignSpecificShifts(töötaja.getSooviPuhkePäevad(), scheduleMatrix, töötaja.getEmployeeId(), "D");
    }

    // Assign Vacation and desired vacation days
    private static void assignSpecificShifts(List<Integer> days, String[][] scheduleMatrix, int workerId, String shift) {
        for (Integer day : days) {
            scheduleMatrix[day - 1][workerId] = shift;
        }
    }

    // Assign Work shifts
    private static void assignSpecificShifts(HashMap<Integer, Shift> workDays, String[][] scheduleMatrix, int workerId, String shift) {
        for (Map.Entry<Integer, Shift> entry : workDays.entrySet()) {
            int day = entry.getKey() - 1; // 0-based index
            scheduleMatrix[day][workerId] = String.valueOf(entry.getValue().getDuration());
        }
    }

    // Fill in rest of the shifts
    private static void fillShifts(String[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {
        for (int i = 0; i < daysInMonth; i++) {
            List<String> yesterdayShifts = getShiftsForDay(scheduleMatrix, i - 1);
            List<String> tomorrowShifts = getShiftsForDay(scheduleMatrix, i + 1);
            List<String> todayShifts = Arrays.asList(scheduleMatrix[i]);

            if (!todayShifts.contains("24")) {
                assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, "24");
            }

            if (!todayShifts.contains("12")) {
                assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, "12");
            }

            // Ensure at least one "24" and one "12" shift per day
            if (!todayShifts.contains("24") || !todayShifts.contains("12")) {
                enforceMinimumShifts(scheduleMatrix, i, todayShifts, töötajateNimekiri);
            }
        }
    }

    // Get Shifts for certain Day
    private static List<String> getShiftsForDay(String[][] scheduleMatrix, int dayIndex) {
        if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) { // First day dont take previous day / Last day dont take next day 
            return Collections.emptyList();
        }
        return Arrays.asList(scheduleMatrix[dayIndex]);
    }

    // Assign needed shifts for the day
    private static void assignShiftForDay(String[][] scheduleMatrix, int dayIndex, List<String> yesterdayShifts, List<String> todayShifts, List<String> tomorrowShifts, String shiftType) {
        for (int personIndex = 0; personIndex < todayShifts.size(); personIndex++) {
            String yesterdayShift = yesterdayShifts.isEmpty() ? "" : yesterdayShifts.get(personIndex);
            String todayShift = todayShifts.get(personIndex);
            String tomorrowShift = tomorrowShifts.isEmpty() ? "" : tomorrowShifts.get(personIndex);

            if (isValidShift(yesterdayShift, todayShift, tomorrowShift, shiftType)) {
                scheduleMatrix[dayIndex][personIndex] = shiftType;
                break;
            }
        }
    }

    // Check if assigning a Shift is possible
    private static boolean isValidShift(String yesterdayShift, String todayShift, String tomorrowShift, String shiftType) {
        if (shiftType.equals("24")) {
            return yesterdayShift.equals("") && todayShift.equals("") && tomorrowShift.equals("");
        }
        if (shiftType.equals("12")) {
            return !yesterdayShift.equals("24") && todayShift.equals("") && !tomorrowShift.equals("24");
        }
        return false;
    }

    // Ensure that each day has at least one "24" and one "12" shift
    private static void enforceMinimumShifts(String[][] scheduleMatrix, int dayIndex, List<String> todayShifts, List<Worker> töötajateNimekiri) {
        if (!todayShifts.contains("24")) {
            assignShiftToWorkerWithD(scheduleMatrix, dayIndex, töötajateNimekiri, "24");
        }
        if (!todayShifts.contains("12")) {
            assignShiftToWorkerWithD(scheduleMatrix, dayIndex, töötajateNimekiri, "12");
        }
    }

    // Assign a shift to a worker who has a desired vacation day ("D")
    private static void assignShiftToWorkerWithD(String[][] scheduleMatrix, int dayIndex, List<Worker> töötajateNimekiri, String shiftType) {
        for (int personIndex = 0; personIndex < töötajateNimekiri.size(); personIndex++) {
            if (scheduleMatrix[dayIndex][personIndex].equals("D")) {
                if (isValidShiftForD(scheduleMatrix, dayIndex, personIndex, shiftType)) {
                    scheduleMatrix[dayIndex][personIndex] = shiftType;
                    break;
                }
            }
        }
    }

    // Check if the shift can be assigned to a worker with "D"
    private static boolean isValidShiftForD(String[][] scheduleMatrix, int dayIndex, int personIndex, String shiftType) {
        String yesterdayShift = dayIndex > 0 ? scheduleMatrix[dayIndex - 1][personIndex] : "";
        String tomorrowShift = dayIndex < scheduleMatrix.length - 1 ? scheduleMatrix[dayIndex + 1][personIndex] : "";
        if (shiftType.equals("24")) {
            return yesterdayShift.equals("") && tomorrowShift.equals("");
        }
        if (shiftType.equals("12")) {
            return !yesterdayShift.equals("24") && !tomorrowShift.equals("24");
        }
        return false;
    }

    // Print Schedule
    private static void printSchedule(String[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        for (int day = 0; day < scheduleMatrix.length; day++) {
            System.out.print("Day " + (day + 1) + ": ");
            for (int emp = 0; emp < scheduleMatrix[day].length; emp++) {
                System.out.print(töötajateNimekiri.get(emp).getNimi() + ": ");
                System.out.print(scheduleMatrix[day][emp] + " ");
            }
            System.out.println();
        }
    }
}
