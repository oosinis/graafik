package refactor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import objects.Shift;
import objects.Worker;

public class AssignShifts {

  // Fill in rest of the shifts
  public static void fillShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {
    for (int i = 0; i < daysInMonth; i++) {
      List<Shift> yesterdayShifts;
      if (i == 0)
        yesterdayShifts = HelperMethods.getEelmisestKuusÜletulevad(scheduleMatrix, töötajateNimekiri);
      else
        yesterdayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, i - 1);
      List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, i + 1);
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
    }
  }

  // Assign needed shifts for the day
  public static void assignShiftForDay(Shift[][] scheduleMatrix, int dayIndex, List<Shift> yesterdayShifts,
      List<Shift> todayShifts, List<Shift> tomorrowShifts, Shift shift) {
    for (int personIndex = 0; personIndex < todayShifts.size(); personIndex++) {
      Shift yesterdayShift = yesterdayShifts.isEmpty() ? new Shift(0, "") : yesterdayShifts.get(personIndex);
      Shift todayShift = todayShifts.get(personIndex);
      Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(personIndex);

      if (isValidShift(yesterdayShift, todayShift, tomorrowShift, shift)) { // Biggest problem: right now
        // assigning it to the first person :(

        if (dayIndex < 6 || HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, personIndex)) {
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

  // Check if assigning a Shift is possible
  public static boolean isValidShift(Shift yesterdayShift, Shift todayShift, Shift tomorrowShift, Shift shift) {

    if (shift.getDuration() == 24) {
      return yesterdayShift.getCategory().equals("") && todayShift.getCategory().equals("")
          && tomorrowShift.getCategory().equals("");
    }
    if (shift.getDuration() == 8) {
      return (yesterdayShift.getDuration() != 24) && (todayShift.getCategory().equals(""))
          && (tomorrowShift.getDuration() != 24);
    }
    return false;
  }

}
