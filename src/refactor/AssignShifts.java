package refactor;

import java.util.Arrays;
import java.util.List;
import objects.Shift;
import objects.Worker;

public class AssignShifts {

  // Fill in rest of the shifts
  public static void fillShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {
    for (int i = 0; i < daysInMonth; i++) {
      List<Shift> todayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, i);
      List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, i + 1);
      List<Shift> dayAfterTomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, i + 2);

      Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
      if (!todayShifts.contains(intensiivShift)) {
        assignShiftForDay(scheduleMatrix, i, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, intensiivShift);
      }

      Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
      if (!todayShifts.contains(osakonnaShift)) {
        assignShiftForDay(scheduleMatrix, i, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, osakonnaShift);
      }

      Shift lühikeShift = new Shift(8, Shift.LÜHIKE_PÄEV);
      if (!todayShifts.contains(lühikeShift)) {
        assignShiftForDay(scheduleMatrix, i, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, lühikeShift);
      }
    }
  }

  // Assign needed shifts for the day
  public static void assignShiftForDay(Shift[][] scheduleMatrix, int dayIndex, List<Shift> todayShifts, List<Shift> tomorrowShifts, List<Shift> dayAfterTomorrowShifts, Shift shift) {
      for (int personIndex = 0; personIndex < todayShifts.size(); personIndex++) {
        Shift todayShift = todayShifts.get(personIndex);
        Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(personIndex);
        Shift dayAfterTomorrowShift = dayAfterTomorrowShifts.isEmpty() ? new Shift(0, "") : dayAfterTomorrowShifts.get(personIndex);

        if (isValidShift(todayShift, tomorrowShift, dayAfterTomorrowShift, shift)) { // Biggest problem: right now assigning it to the first person :(
          if (dayIndex < 6 || HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, personIndex)) {
            if (shift.getDuration() == 24) {
              AssignWorkerWishes.assignSpecificShifts(Arrays.asList(dayIndex + 1, dayIndex + 2), scheduleMatrix,
                  personIndex,
                  new Shift(0, Shift.KEELATUD));
            }
            scheduleMatrix[dayIndex][personIndex] = shift;
            break;
          }
        }
      }
  }

  // Check if assigning a Shift is possible
  public static boolean isValidShift(Shift todayShift, Shift tomorrowShift,Shift dayAfterTomorrowShift ,Shift shift) {
    if (shift.getDuration() == 24) {
      return todayShift.getCategory().equals("") && tomorrowShift.getCategory().equals("") && dayAfterTomorrowShift.getDuration() == 0;
    }
    if (shift.getDuration() == 8) {
      return todayShift.getCategory().equals("") && tomorrowShift.getDuration() != 24;
    }
    return false;
  }

}
