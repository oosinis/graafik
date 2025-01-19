package com.graafik.schedule;

import java.util.*;
import java.util.stream.Collectors;

import com.graafik.model.RecordedShift;

import com.graafik.model.Shift;
import com.graafik.model.Worker;

public class HelperMethods {

  public static List<Shift> getShiftsForDay(Shift[][] scheduleMatrix, int dayIndex) {
    if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) return Collections.emptyList();
    return Arrays.asList(scheduleMatrix[dayIndex]);
  }

  public static Boolean atLeastTwoRestdays(Shift[][] scheduleMatrix, int dayIndex, int workerIndex) {
    int consecutiveRestDays = 0;

    for (int i = dayIndex - 5; i < dayIndex; i++) {
      if (i < 0) return true;
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
    return false;
  }

  public static Boolean atMostXDaysInARow(Shift[][] scheduleMatrix, int dayIndex, int workerIndex, int x) {
    int consecutiveWorkDays = 0;

    for (int i = dayIndex - x; i <= dayIndex + x; i++) {
      if (i < 0 || i >= scheduleMatrix.length) continue;
      Shift shift = scheduleMatrix[i][workerIndex];
      if (shift.getDuration() != 0 || i == dayIndex) {
        consecutiveWorkDays++;
        if (consecutiveWorkDays >= x + 1) {
          return false;
        }
      } else {
        consecutiveWorkDays = 0;
      }
    }
    return true;
  }

  public static int getDay(int dateIndex, int firstDayOfMonth) {
    return (dateIndex + firstDayOfMonth) % 7;
  }

    public static List<Worker> FilterWorkers(List<Worker> workers, int hoursBalance) {
        var negativeWorkers = workers.stream().filter(w -> w.getQuarterBalance() <= hoursBalance).collect(Collectors.toList());
        negativeWorkers.sort(Comparator.comparingDouble(Worker::getQuarterBalance));
        return negativeWorkers;
    }

    public static void removeShiftFromDay(Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, RecordedShift recorded) {
        // Get the worker that got assigned the last shift
        Worker worker = recorded.getWorker();
        int shiftDuration = scheduleMatrix[recorded.getShiftDate()][worker.getEmployeeId()].getDuration();
        // Chaenge back the balance of that worker
        worker.setQuarterBalance(worker.getQuarterBalance() - shiftDuration);

        // If the shift was 24h then remove one from the count
        // and replace the forbidden days with the original categories for those days
        if (shiftDuration == 24) worker.setNumOf24hShifts(worker.getNumOf24hShifts() + 1);
        for (int i = 0; i < 3 && i + recorded.getShiftDate() < scheduleMatrixOriginal.length; i++) {
            scheduleMatrix[recorded.getShiftDate() + i][worker.getEmployeeId()] = scheduleMatrixOriginal[recorded.getShiftDate() + i][worker.getEmployeeId()];
        }

    }

    public static int backtrack(List<RecordedShift> recordedShifts, Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, List<Worker> workers, Map<Integer, List<Worker>> unusedWorkers) {
        if (!recordedShifts.isEmpty()) {
            RecordedShift recorded = recordedShifts.removeLast();


            List<Worker> workersCopy = new ArrayList<>();
            for (int i = 0; i < scheduleMatrixOriginal[recorded.getShiftDate() + 1].length; i++) {
                if (!scheduleMatrixOriginal[recorded.getShiftDate() + 1][i].getType().equals(Shift.KEELATUD) && !scheduleMatrix[recorded.getShiftDate() + 1][i].getType().equals(Shift.PUHKUS) && !scheduleMatrix[recorded.getShiftDate() + 1][i].getType().equals(Shift.KOOLITUS)) workersCopy.add(workers.get(i));
            }

            unusedWorkers.put(recorded.getShiftDate() + 1, workersCopy);
            removeShiftFromDay(scheduleMatrix, scheduleMatrixOriginal, recorded);
            return recorded.getShiftDate();

        }
        return -1;
    }

}