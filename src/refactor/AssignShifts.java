package refactor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import objects.Shift;
import objects.Worker;

public class AssignShifts {

  // Fill in rest of the shifts
  public static void fillShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> workers) {
    for (int dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {
      List<Shift> todayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex);
      List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 1);
      List<Shift> dayAfterTomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 2);

      Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
      Shift intensiivShiftKuuLõpp = new Shift(16, Shift.INTENSIIV);

      if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftKuuLõpp)) {
        assignShiftForDay(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, intensiivShift,
            workers);
      }
      if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftKuuLõpp)) {
        EnforceShifts.assignShiftToWorkerWithD(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts,
            dayAfterTomorrowShifts, intensiivShift, workers);
      }
      if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftKuuLõpp)) System.out.println("Kuupäeval " + dayIndex + " puudu intensiiv vahetus");

      Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
      Shift osakonnaShiftKuuLõpp = new Shift(16, Shift.OSAKOND);

      if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftKuuLõpp)) {
        assignShiftForDay(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, osakonnaShift,
            workers);
      }
      if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftKuuLõpp)) {
        EnforceShifts.assignShiftToWorkerWithD(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts,
            dayAfterTomorrowShifts, osakonnaShift, workers);
      }
      if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftKuuLõpp)) System.out.println("Kuupäeval " + dayIndex + " puudu osakonna vahetus");

      Shift lühikeShift = new Shift(8, Shift.LÜHIKE_PÄEV);
      if (!todayShifts.contains(lühikeShift)) {
        assignShiftForDay(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, lühikeShift,
            workers);
      }
      if (!todayShifts.contains(lühikeShift)) {
        EnforceShifts.assignShiftToWorkerWithD(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts,
            dayAfterTomorrowShifts, lühikeShift, workers);
      }
      if (!todayShifts.contains(intensiivShift)) System.out.println("Kuupäeval " + dayIndex + " puudu lühike vahetus");

    }
  }

  // Assign needed shifts for the day
  public static void assignShiftForDay(Shift[][] scheduleMatrix, int dayIndex, List<Shift> todayShifts,
      List<Shift> tomorrowShifts, List<Shift> dayAfterTomorrowShifts, Shift shift, List<Worker> workers) {
    List<Worker> sortedWorkers = new ArrayList<>(workers);
    sortedWorkers.sort(Comparator.comparingDouble(Worker::getPercentageWorked));

    for (Worker worker : sortedWorkers) {

      Shift todayShift = todayShifts.get(worker.getEmployeeId()); // that worker's shift today
      Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(worker.getEmployeeId());
      Shift dayAfterTomorrowShift = dayAfterTomorrowShifts.isEmpty() ? new Shift(0, "")
          : dayAfterTomorrowShifts.get(worker.getEmployeeId());

      if (isValidShift(todayShift, tomorrowShift, dayAfterTomorrowShift, shift)) {
        if (dayIndex < 6 || HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, worker.getEmployeeId())) {
          if (shift.getDuration() == 24) {
            AssignWorkerWishes.assignSpecificShifts(Arrays.asList(dayIndex + 2, dayIndex + 3), scheduleMatrix,
                worker.getEmployeeId(),
                new Shift(0, Shift.KEELATUD));

            if (dayIndex == scheduleMatrix.length - 1) shift = new Shift(16, shift.getCategory());

          }

          scheduleMatrix[dayIndex][worker.getEmployeeId()] = shift;

          worker.setHoursWorked(shift.getDuration());
          worker.setHoursBalance(worker.getHoursBalance() + shift.getDuration());
          worker.setPercentageWorked((shift.getDuration() * 100) / worker.getWorkLoadHours());

          break;
        }
      }
    }
  }

  // Check if assigning a Shift is possible
  public static boolean isValidShift(Shift todayShift, Shift tomorrowShift, Shift dayAfterTomorrowShift, Shift shift) {
    if (shift.getDuration() == 24) {
      return todayShift.getCategory().equals(Shift.TÜHI) && tomorrowShift.getCategory().equals(Shift.TÜHI)
          && dayAfterTomorrowShift.getDuration() == 0;
    }
    if (shift.getDuration() == 8) {
      return todayShift.getCategory().equals("") && tomorrowShift.getDuration() != 24;
    }
    return false;
  }

}
