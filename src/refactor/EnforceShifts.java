package refactor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import objects.Shift;
import objects.Worker;

public class EnforceShifts {
  // Assign a shift to a worker who has a desired vacation day ("D")
  public static void assignShiftToWorkerWithD(Shift[][] scheduleMatrix, int dayIndex, List<Shift> todayShifts,
      List<Shift> tomorrowShifts, List<Shift> dayAfterTomorrowShifts, Shift shift, List<Worker> workers) {
    List<Worker> sortedWorkers = new ArrayList<>(workers);
    sortedWorkers.sort(Comparator.comparingDouble(Worker::getPercentageWorked));

    for (Worker worker : sortedWorkers) {
      if (!scheduleMatrix[dayIndex][worker.getEmployeeId()].getCategory().equals("D"))
        continue;

      Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(worker.getEmployeeId());
      Shift dayAfterTomorrowShift = dayAfterTomorrowShifts.isEmpty() ? new Shift(0, "")
          : dayAfterTomorrowShifts.get(worker.getEmployeeId());

      if (isValidShiftForD(tomorrowShift, dayAfterTomorrowShift, shift, worker)) {
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
          worker.setPercentageWorked((double) (shift.getDuration() * 100) / worker.getWorkLoadHours());

          break;
        }
      }
    }
  }

  // Check if the shift can be assigned to a worker with "D"
  public static boolean isValidShiftForD(Shift tomorrowShift, Shift dayAfterTomorrowShift, Shift shift, Worker worker) {

    if (shift.getDuration() == 24) {
      return tomorrowShift.getCategory().equals(Shift.TÜHI) && dayAfterTomorrowShift.getDuration() == 0 && worker.getHoursBalance() <= -16;
    }

    if (shift.getDuration() == 8) {
      return tomorrowShift.getDuration() != 24 && worker.getHoursBalance() <= 0;
    }

    return false;
  }
}
