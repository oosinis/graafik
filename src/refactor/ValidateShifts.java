package refactor;

import objects.Shift;

public class ValidateShifts {

  // Check if assigning a Shift is possible
  private static boolean isValidShift(Shift yesterdayShift, Shift todayShift, Shift tomorrowShift, Shift shift) {

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

  private static Boolean atLeastTwoRestdays(Shift[][] scheduleMatrix, int dayIndex, int workerIndex) {

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
