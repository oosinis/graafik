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
        Shift[][] scheduleMatrix = initializeScheduleMatrix(daysInMonth, töötajateNimekiri.size());

        assignWorkerWishes(töötajateNimekiri, scheduleMatrix);

        // esimene võtab eelmise päeva vahetused selle üleliigse 8h järgi mis tabelis
        fillFirstDayShifts(scheduleMatrix, töötajateNimekiri);
        fillShifts(scheduleMatrix, daysInMonth, töötajateNimekiri);

        printScheduleAndCalculateHours(scheduleMatrix, töötajateNimekiri);
    }

    // Initialize empty matrix
    private static Shift[][] initializeScheduleMatrix(int daysInMonth, int numberOfWorkers) {
        Shift[][] scheduleMatrix = new Shift[daysInMonth][numberOfWorkers];
        for (int i = 0; i < daysInMonth; i++) {
            Arrays.fill(scheduleMatrix[i], new Shift(0, ""));
        }
        return scheduleMatrix;
    }

    // Fill in Workers requested days
    private static void assignWorkerWishes(List<Worker> töötajateNimekiri, Shift[][] scheduleMatrix) {
        for (Worker töötaja : töötajateNimekiri) {
            assignShifts(töötaja, scheduleMatrix);
        }
    }

    // Get day types
    private static void assignShifts(Worker töötaja, Shift[][] scheduleMatrix) {
        assignSooviTööpäevad(töötaja.getSooviTööPäevad(), scheduleMatrix, töötaja.getEmployeeId());
        assignSpecificShifts(töötaja.getPuhkusePäevad(), scheduleMatrix, töötaja.getEmployeeId(), new Shift(0, "P"));
        assignSpecificShifts(töötaja.getSooviPuhkePäevad(), scheduleMatrix, töötaja.getEmployeeId(), new Shift(0, "D"));
    }

    // Assign Vacation and desired vacation days
    private static void assignSpecificShifts(List<Integer> days, Shift[][] scheduleMatrix, int workerId, Shift shift) {
        for (Integer day : days) {
            scheduleMatrix[day - 1][workerId] = shift;
        }
    }

    // Assign Work shifts
    private static void assignSooviTööpäevad(HashMap<Integer, Shift> workDays, Shift[][] scheduleMatrix, int workerId) {
        for (Map.Entry<Integer, Shift> entry : workDays.entrySet()) {
            int day = entry.getKey() - 1; // Adjust for 0-based index
            Shift shift = entry.getValue();
            scheduleMatrix[day][workerId] = shift;
        }
    }

    // Fill in rest of the shifts
    private static void fillFirstDayShifts(Shift[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        int i = 0;
        List<Shift> yesterdayShifts = getEelmisestKuusÜletulevad(scheduleMatrix, töötajateNimekiri);
        List<Shift> tomorrowShifts = getShiftsForDay(scheduleMatrix, i + 1);
        List<Shift> todayShifts = Arrays.asList(scheduleMatrix[i]);

        Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
        if (!todayShifts.contains(intensiivShift)) {
            assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, intensiivShift);
        }

        Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
        if (!todayShifts.contains(osakonnaShift)) {
            assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, osakonnaShift);
        }

        Shift lühikeShift = new Shift(8, Shift.LÜHIKE_PÄEV);
        if (!todayShifts.contains(lühikeShift)) {
            assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, lühikeShift);
        }

        // Ensure at least one "24" and one "12" shift per day
        if (!todayShifts.contains(intensiivShift) || !todayShifts.contains(osakonnaShift)
                || !todayShifts.contains(lühikeShift)) {
            enforceMinimumShifts(scheduleMatrix, i, todayShifts, töötajateNimekiri);
        }

    }

    // Fill in rest of the shifts
    private static void fillShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {
        for (int i = 1; i < daysInMonth; i++) {
            List<Shift> yesterdayShifts = getShiftsForDay(scheduleMatrix, i - 1);
            System.out.println(yesterdayShifts);
            List<Shift> tomorrowShifts = getShiftsForDay(scheduleMatrix, i + 1);
            List<Shift> todayShifts = Arrays.asList(scheduleMatrix[i]);

            Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
            if (!todayShifts.contains(intensiivShift)) {
                assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, intensiivShift);
            }

            Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
            if (!todayShifts.contains(osakonnaShift)) {
                assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, osakonnaShift);
            }

            Shift lühikeShift = new Shift(8, Shift.LÜHIKE_PÄEV);
            if (!todayShifts.contains(lühikeShift)) {
                assignShiftForDay(scheduleMatrix, i, yesterdayShifts, todayShifts, tomorrowShifts, lühikeShift);
            }

            // Ensure at least one "24" and one "12" shift per day
            if (!todayShifts.contains(intensiivShift) || !todayShifts.contains(osakonnaShift)
                    || !todayShifts.contains(lühikeShift)) {
                enforceMinimumShifts(scheduleMatrix, i, todayShifts, töötajateNimekiri);
            }
        }
    }

    private static List<Shift> getEelmisestKuusÜletulevad(Shift[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        List<Shift> eelmiseKuuVahetused = new ArrayList<>();
        for (Worker worker : töötajateNimekiri) {
            // ei tea kas on intensiivis, aga otseselt pole vahet
            if (worker.getEelmiseKuuVahetuseTunnid() == 8) eelmiseKuuVahetused.add(new Shift(24, Shift.INTENSIIV));
            else eelmiseKuuVahetused.add(new Shift(0, ""));
        }
        return eelmiseKuuVahetused;
    }

    // Get Shifts for certain Day
    private static List<Shift> getShiftsForDay(Shift[][] scheduleMatrix, int dayIndex) {
        if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) { // First day dont take previous day / Last day dont
                                                                 // take next day
            return Collections.emptyList();
        }
        return Arrays.asList(scheduleMatrix[dayIndex]);
    }

    // Assign needed shifts for the day
    private static void assignShiftForDay(Shift[][] scheduleMatrix, int dayIndex, List<Shift> yesterdayShifts,
            List<Shift> todayShifts, List<Shift> tomorrowShifts, Shift shift) {
        for (int personIndex = 0; personIndex < todayShifts.size(); personIndex++) {
            Shift yesterdayShift = yesterdayShifts.isEmpty() ? new Shift(0, "") : yesterdayShifts.get(personIndex);
            Shift todayShift = todayShifts.get(personIndex);
            Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(personIndex);

            if (isValidShift(yesterdayShift, todayShift, tomorrowShift, shift)) { // Biggest problem: right now
                                                                                  // assigning it to the first person :(
                scheduleMatrix[dayIndex][personIndex] = shift;
                break;
            }
        }
    }

    // Check if assigning a Shift is possible
    private static boolean isValidShift(Shift yesterdayShift, Shift todayShift, Shift tomorrowShift, Shift shift) {
        if (shift.getDuration() == 24) {
            return yesterdayShift.getCategory().equals("") && todayShift.getCategory().equals("")
                    && tomorrowShift.getCategory().equals("");
        }
        if (shift.getDuration() == 12) {
            return (yesterdayShift.getDuration() != 24) && (todayShift.getCategory().equals(""))
                    && (tomorrowShift.getDuration() != 24);
        }
        return false;
    }

    // Ensure that each day has at least one "24" and one "12" shift
    private static void enforceMinimumShifts(Shift[][] scheduleMatrix, int dayIndex, List<Shift> todayShifts,
            List<Worker> töötajateNimekiri) {

        Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
        if (!todayShifts.contains(intensiivShift)) {
            assignShiftToWorkerWithD(scheduleMatrix, dayIndex, töötajateNimekiri, intensiivShift);
        }

        Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
        if (!todayShifts.contains(osakonnaShift)) {
            assignShiftToWorkerWithD(scheduleMatrix, dayIndex, töötajateNimekiri, osakonnaShift);
        }

        Shift lühikeShift = new Shift(8, Shift.LÜHIKE_PÄEV);
        if (!todayShifts.contains(lühikeShift)) {
            assignShiftToWorkerWithD(scheduleMatrix, dayIndex, töötajateNimekiri, lühikeShift);
        }
    }

    // Assign a shift to a worker who has a desired vacation day ("D")
    private static void assignShiftToWorkerWithD(Shift[][] scheduleMatrix, int dayIndex, List<Worker> töötajateNimekiri,
            Shift shift) {
        for (int personIndex = 0; personIndex < töötajateNimekiri.size(); personIndex++) {
            if (scheduleMatrix[dayIndex][personIndex].getCategory().equals("D")) {
                if (isValidShiftForD(scheduleMatrix, dayIndex, personIndex, shift)) {
                    scheduleMatrix[dayIndex][personIndex] = shift;
                    break;
                }
            }
        }
    }

    // Check if the shift can be assigned to a worker with "D"
    private static boolean isValidShiftForD(Shift[][] scheduleMatrix, int dayIndex, int personIndex, Shift shift) {
        Shift yesterdayShift = dayIndex > 0 ? scheduleMatrix[dayIndex - 1][personIndex] : new Shift(0, "");
        Shift tomorrowShift = dayIndex < scheduleMatrix.length - 1 ? scheduleMatrix[dayIndex + 1][personIndex]
                : new Shift(0, "");
        if (shift.getDuration() == 24) {
            return yesterdayShift.getCategory().equals("") && tomorrowShift.getCategory().equals("");
        }
        if (shift.getDuration() == 8) {
            return yesterdayShift.getDuration() != 24 && tomorrowShift.getDuration() != 24;
        }
        return false;
    }

    // Print Schedule and calculate total hours worked by each employee
    private static void printScheduleAndCalculateHours(Shift[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        int[] totalHours = new int[töötajateNimekiri.size()]; // Array to store total hours for each employee

        for (int day = 0; day < scheduleMatrix.length; day++) {
            System.out.print("Day " + (day + 1) + ": ");
            for (int emp = 0; emp < scheduleMatrix[day].length; emp++) {
                Shift shift = scheduleMatrix[day][emp];

                totalHours[emp] += shift.getDuration(); // Add shift duration to the employee's total hours

                System.out.print(töötajateNimekiri.get(emp).getNimi() + ": ");
                System.out.print(shift.getDuration() + " ");
            }
            System.out.println();
        }

        // Print total hours worked by each employee
        System.out.println("\nTotal hours worked by each employee:");
        for (int emp = 0; emp < totalHours.length; emp++) {
            System.out.println(töötajateNimekiri.get(emp).getNimi() + ": " + totalHours[emp] + " hours");
        }
    }
}