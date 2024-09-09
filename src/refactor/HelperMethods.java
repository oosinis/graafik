package refactor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import objects.Shift;
import objects.Worker;

public class HelperMethods {

  // Get Shifts for certain Day
  public static List<Shift> getShiftsForDay(Shift[][] scheduleMatrix, int dayIndex) {
    if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) return Collections.emptyList();
    return Arrays.asList(scheduleMatrix[dayIndex]);
  }

  // Ensure 2 restdays for 24hr shift
  public static Boolean atLeastTwoRestdays(Shift[][] scheduleMatrix, int dayIndex, int workerIndex) {
    int consecutiveRestDays = 0;

    for (int i = dayIndex - 5; i < dayIndex; i++) {
      Shift shift = scheduleMatrix[i][workerIndex];

      if (shift.getDuration() == 0) {
        consecutiveRestDays++;
        if (consecutiveRestDays >= 2) {
          return true;
        }
      } else {
        consecutiveRestDays = 0;
      }
    }
    return false; // No two consecutive rest days found
  }

  public static int getDay(int dateIndex, int firstDayOfMonth) {

    return (dateIndex + firstDayOfMonth) % 7;
  }

  public static List<Worker> FilterWorkers(List<Worker> workers, int hoursBalance) {
      var negativeWorkers = workers.stream().filter(w -> w.getHoursBalance() <= hoursBalance).collect(Collectors.toList());
      negativeWorkers.sort(Comparator.comparingDouble(Worker::getHoursBalance));
      return negativeWorkers;
  }
}

