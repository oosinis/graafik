package refactor;

import java.util.Arrays;
import java.util.List;

import objects.Shift;
import objects.Worker;

public class EnforceShifts {

  


    // Ensure that each day has at least one "24" and one "8" shift
    public static void enforceMinimumShifts(Shift[][] scheduleMatrix, int daysInMonth, List<Worker> töötajateNimekiri) {
        for (int dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {
            List<Shift> yesterdayShifts;
            if (dayIndex == 0)
              yesterdayShifts = HelperMethods.getEelmisestKuusÜletulevad(scheduleMatrix, töötajateNimekiri);
            else
              yesterdayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex - 1);
            List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 1);
            List<Shift> todayShifts = Arrays.asList(scheduleMatrix[dayIndex]);

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
    }

    // Assign a shift to a worker who has a desired vacation day ("D")
    public static void assignShiftToWorkerWithD(Shift[][] scheduleMatrix, int dayIndex, List<Worker> töötajateNimekiri,
            Shift shift) {
        for (int personIndex = 0; personIndex < töötajateNimekiri.size(); personIndex++) {
            if (scheduleMatrix[dayIndex][personIndex].getCategory().equals("D")) {
                if (isValidShiftForD(scheduleMatrix, dayIndex, personIndex, shift)) {
                    if (dayIndex < 6 || HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, personIndex)) {

                        scheduleMatrix[dayIndex][personIndex] = shift;
                        break;
                    }
                }
            }
        }
    }

    // Check if the shift can be assigned to a worker with "D"
    public static boolean isValidShiftForD(Shift[][] scheduleMatrix, int dayIndex, int personIndex, Shift shift) {
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

  
}
