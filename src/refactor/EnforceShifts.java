package refactor;

import java.util.Arrays;
import java.util.List;

import objects.Shift;
import objects.Worker;

public class EnforceShifts {

  // Ensure that each day has at least one "24" and one "8" shift
  public static void enforceMinimumShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {

    for (int dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {

      List<Shift> todayShifts = Arrays.asList(scheduleMatrix[dayIndex]);
      List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 1);
      List<Shift> dayAfterTomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 2);

      Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
      if (!todayShifts.contains(intensiivShift)) {
        assignShiftToWorkerWithD(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts,
            töötajateNimekiri, intensiivShift);
      }

      Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
      if (!todayShifts.contains(osakonnaShift)) {
        assignShiftToWorkerWithD(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts,
            töötajateNimekiri, osakonnaShift);
      }

      Shift lühikeShift = new Shift(8, Shift.LÜHIKE_PÄEV);
      if (!todayShifts.contains(lühikeShift)) {
        assignShiftToWorkerWithD(scheduleMatrix, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts,
            töötajateNimekiri, lühikeShift);
      }
    }
  }

  // Assign a shift to a worker who has a desired vacation day ("D")
  public static void assignShiftToWorkerWithD(Shift[][] scheduleMatrix, int dayIndex, List<Shift> todayShifts,
      List<Shift> tomorrowShifts, List<Shift> dayAfterTomorrowShifts, List<Worker> töötajateNimekiri,
      Shift shift) {
    for (int personIndex = 0; personIndex < töötajateNimekiri.size(); personIndex++) {
      if (scheduleMatrix[dayIndex][personIndex].getCategory().equals("D")) {

        Shift todayShift = todayShifts.get(personIndex);
        Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(personIndex);
        Shift dayAfterTomorrowShift = dayAfterTomorrowShifts.isEmpty() ? new Shift(0, "")
            : dayAfterTomorrowShifts.get(personIndex);

        if (isValidShiftForD(todayShift, tomorrowShift, dayAfterTomorrowShift, shift)) { 
          if (dayIndex < 6 || HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, personIndex)) {
            if (shift.getDuration() == 24) {
              AssignWorkerWishes.assignSpecificShifts(Arrays.asList(dayIndex + 2, dayIndex + 3), scheduleMatrix,
                  personIndex,
                  new Shift(0, Shift.KEELATUD));
            }
            scheduleMatrix[dayIndex][personIndex] = shift;
            break;
          }
        }
      }
    }
  }

  // Check if the shift can be assigned to a worker with "D"
  public static boolean isValidShiftForD(Shift todayShift, Shift tomorrowShift,Shift dayAfterTomorrowShift ,Shift shift) {

    if (shift.getDuration() == 24) {
      return tomorrowShift.getCategory().equals(Shift.TÜHI) && dayAfterTomorrowShift.getDuration() == 0;
    }
    
    if (shift.getDuration() == 8) {
      return tomorrowShift.getDuration() != 24;
    }
      
    return false;
  }
}
