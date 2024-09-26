package refactor;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import objects.Shift;
import objects.Worker;

public class AssignExtraShifts {
    public static void addExtraShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> workers, int firstDayOfMonth) {
        var filteredWorkers = HelperMethods.FilterWorkers(workers, -8);

        for (int dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {

            int weekday = HelperMethods.getDay(dayIndex, firstDayOfMonth);
            if (weekday == 0 || weekday == 6) continue;

            List<Shift> todayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex);
            List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 1);
            List<Shift> dayAfterTomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 2);
            Shift lühikeShift = new Shift(8, Shift.INTENSIIV);


            assignShiftForDay(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, lühikeShift, filteredWorkers);
            todayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex);
            assignShiftForDay(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, lühikeShift, filteredWorkers);
            filteredWorkers = HelperMethods.FilterWorkers(filteredWorkers, -8);
        }
    }

    // Assign needed shifts for the day
    public static void assignShiftForDay(Shift[][] scheduleMatrix, int dayIndex, List<Shift> todayShifts, List<Shift> tomorrowShifts, List<Shift> dayAfterTomorrowShifts, Shift shift, List<Worker> workers) {
        List<Worker> sortedWorkers = new ArrayList<>(workers);
        sortedWorkers.sort(Comparator.comparingDouble(Worker::getPercentageWorked));

        for (Worker worker : sortedWorkers) {

            Shift todayShift = todayShifts.get(worker.getEmployeeId()); // that worker's shift today
            Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(worker.getEmployeeId());
            Shift dayAfterTomorrowShift = dayAfterTomorrowShifts.isEmpty() ? new Shift(0, "")
                    : dayAfterTomorrowShifts.get(worker.getEmployeeId());

            if (isValidShift(scheduleMatrix, dayIndex, worker, todayShift, tomorrowShift, dayAfterTomorrowShift, shift)) {
                scheduleMatrix[dayIndex][worker.getEmployeeId()] = shift;
                worker.setHoursBalance(worker.getHoursBalance() + shift.getDuration());
                break;
            }
        }
    }

    public static boolean isValidShift(Shift[][] scheduleMatrix, int dayIndex, Worker worker, Shift todayShift, Shift tomorrowShift, Shift dayAfterTomorrowShift, Shift shift) {
        if (!HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, worker.getEmployeeId())|| !HelperMethods.atMostXDaysInARow(scheduleMatrix, dayIndex, worker.getEmployeeId(), 2)) return false;

        return todayShift.getCategory().equals(Shift.TÜHI) && tomorrowShift.getDuration() != 24  && tomorrowShift.getDuration() != 16 && worker.getHoursBalance() <= 0;
    }
}