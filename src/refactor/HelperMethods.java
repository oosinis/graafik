package refactor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import objects.Shift;
import objects.Worker;

public class HelperMethods {

  // Get Shifts for certain Day
  public static List<Shift> getShiftsForDay(Shift[][] scheduleMatrix, int dayIndex) {
    if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) { // First day dont take previous day / Last day dont take
                                                             // next day
      return Collections.emptyList();
    }
    return Arrays.asList(scheduleMatrix[dayIndex]);
  }

  public static List<Shift> getEelmisestKuusÜletulevad(Shift[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
    List<Shift> eelmiseKuuVahetused = new ArrayList<>();
    for (Worker worker : töötajateNimekiri) {
      // ei tea kas on intensiivis, aga otseselt pole vahet
      if (worker.getEelmiseKuuVahetuseTunnid() == 8)
        eelmiseKuuVahetused.add(new Shift(24, Shift.INTENSIIV));
      else
        eelmiseKuuVahetused.add(new Shift(0, ""));
    }
    return eelmiseKuuVahetused;
  }

  
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
}

