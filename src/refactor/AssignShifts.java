package refactor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import objects.Shift;
import objects.Worker;

public class AssignShifts {

  // Fill in rest of the shifts
  private static void fillShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {
    for (int i = 0; i < daysInMonth; i++) {
      List<Shift> yesterdayShifts;
      if (i == 0)
        yesterdayShifts = getEelmisestKuusÜletulevad(scheduleMatrix, töötajateNimekiri);
      else
        yesterdayShifts = getShiftsForDay(scheduleMatrix, i - 1);
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
      // Ensure at least one "24" and one "8" shift per day
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
      if (worker.getEelmiseKuuVahetuseTunnid() == 8)
        eelmiseKuuVahetused.add(new Shift(24, Shift.INTENSIIV));
      else
        eelmiseKuuVahetused.add(new Shift(0, ""));
    }
    return eelmiseKuuVahetused;
  }

  // Get Shifts for certain Day
  private static List<Shift> getShiftsForDay(Shift[][] scheduleMatrix, int dayIndex) {
    if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) { // First day dont take previous day / Last day dont take
                                                             // next day
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

        if (dayIndex < 6 || atLeastTwoRestdays(scheduleMatrix, dayIndex, personIndex)) {
          if (shift.getDuration() == 24) {
            AssignWorkerWishes.assignSpecificShifts(Arrays.asList(dayIndex + 1, dayIndex + 2), scheduleMatrix,
                personIndex,
                new Shift(0, "P"));
          }
          scheduleMatrix[dayIndex][personIndex] = shift;
          break;
        }
      }
    }
  }

  

}
