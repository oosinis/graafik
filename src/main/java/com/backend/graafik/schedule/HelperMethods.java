package com.backend.graafik.schedule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import com.backend.graafik.model.RecordedShift;

import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

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

        Worker worker = recorded.getWorker();
        int shiftDuration = scheduleMatrix[recorded.getShiftDate()][worker.getEmployeeId()].getDuration();
        worker.setQuarterBalance(worker.getQuarterBalance() - shiftDuration);

        if (shiftDuration == 24) {

            worker.setNumOf24hShifts(worker.getNumOf24hShifts() + 1);
        }
        for (int i = 0; i < 3 && i + recorded.getShiftDate() < scheduleMatrixOriginal.length; i++) {
            scheduleMatrix[recorded.getShiftDate() + i][worker.getEmployeeId()] = scheduleMatrixOriginal[recorded.getShiftDate() + i][worker.getEmployeeId()];
        }

    }

    public static void backtrack(List<RecordedShift> recordedShifts, Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, List<Worker> workers, Map<Integer, List<Worker>> unusedWorkers) {
        if (!recordedShifts.isEmpty()) {
            RecordedShift recorded = recordedShifts.removeLast();
            unusedWorkers.put(recorded.getShiftDate() + 1, new ArrayList<>(workers));
            removeShiftFromDay(scheduleMatrix, scheduleMatrixOriginal, recorded);
            AssignShifts.fillShifts(scheduleMatrix, scheduleMatrixOriginal, workers, recordedShifts, recorded, unusedWorkers);
        }
    }

}