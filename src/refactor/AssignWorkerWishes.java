package refactor;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import objects.Shift;
import objects.Worker;

public class AssignWorkerWishes {

  // Initialize empty matrix
  public static Shift[][] initializeScheduleMatrix(int daysInMonth, int numberOfWorkers) {
    Shift[][] scheduleMatrix = new Shift[daysInMonth][numberOfWorkers];
    for (int i = 0; i < daysInMonth; i++) {
      Arrays.fill(scheduleMatrix[i], new Shift(0, ""));
    }
    return scheduleMatrix;
  }

  // Fill in Workers requested days
  public static void assignWorkerWishes(List<Worker> töötajateNimekiri, Shift[][] scheduleMatrix) {
    for (Worker töötaja : töötajateNimekiri) {
      assignShifts(töötaja, scheduleMatrix);
    }
  }

  // Get day types
  public static void assignShifts(Worker töötaja, Shift[][] scheduleMatrix) {
    assignSooviTööpäevad(töötaja, scheduleMatrix);
    assignSpecificShifts(töötaja.getVacationDays(), scheduleMatrix, töötaja.getEmployeeId(), new Shift(0, "P"));
    assignSpecificShifts(töötaja.getDesiredVacationDays(), scheduleMatrix, töötaja.getEmployeeId(), new Shift(0, "D"));
  }

  // Assign Vacation and desired vacation days
  public static void assignSpecificShifts(List<Integer> days, Shift[][] scheduleMatrix, int workerId, Shift shift) {
    for (Integer day : days) {
      try {
        scheduleMatrix[day - 1][workerId] = shift;
      } catch (ArrayIndexOutOfBoundsException e) {
        break;
      }
    }
  }

  // Assign Work shifts
  private static void assignSooviTööpäevad(Worker worker, Shift[][] scheduleMatrix) {
    HashMap<Integer, Shift> workDays = worker.getDesiredWorkDays();
    int workerId = worker.getEmployeeId();

    for (Map.Entry<Integer, Shift> entry : workDays.entrySet()) {
      int day = entry.getKey() - 1; // Adjust for 0-based index
      Shift shift = entry.getValue();
      if (day == scheduleMatrix.length - 1 && shift.getDuration() == 24)
        shift = new Shift(16, shift.getCategory());
      scheduleMatrix[day][workerId] = shift;
    }

  }
}
