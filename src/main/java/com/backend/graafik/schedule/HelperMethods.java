package com.backend.graafik.schedule;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import com.backend.graafik.model.RecordedShift;
import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

public class HelperMethods {

    public static List<Shift> getShiftsForDay(Shift[][] scheduleMatrix, int dayIndex) {
        if (dayIndex < 0 || dayIndex >= scheduleMatrix.length) {
            return Collections.emptyList();
        }
        return Arrays.asList(scheduleMatrix[dayIndex]);
    }

    public static Boolean atLeastTwoRestdays(Shift[][] scheduleMatrix, int dayIndex, int workerIndex) {
        int consecutiveRestDays = 0;

        for (int i = dayIndex - 5; i < dayIndex; i++) {
            if (i < 0) {
                return true;
            }
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
            if (i < 0 || i >= scheduleMatrix.length) {
                continue;
            }
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
        var negativeWorkers = workers.stream().filter(w -> w.getHoursBalance() <= hoursBalance).collect(Collectors.toList());
        negativeWorkers.sort(Comparator.comparingDouble(Worker::getHoursBalance));
        return negativeWorkers;
    }

    public static void removeShiftFromDay(Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, RecordedShift recorded) {
        for (int i = 0; i < 3 && i + recorded.getShiftDate() < scheduleMatrixOriginal.length; i++) {
            scheduleMatrix[recorded.getShiftDate() + i][recorded.getWorkerId()] = scheduleMatrixOriginal[recorded.getShiftDate() + i][recorded.getWorkerId()];
        }
    }

    public static void backtrack(List<RecordedShift> recordedShifts, RecordedShift lastRecordedShift, AtomicBoolean backtrack, Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, List<Worker> workers) {
      if (!recordedShifts.isEmpty()) {
        RecordedShift recorded = recordedShifts.remove(recordedShifts.size() - 1);
        lastRecordedShift.setShiftDate(recorded.getShiftDate());
        lastRecordedShift.setWorkerId(recorded.getWorkerId());
        lastRecordedShift.setScheduleScore(recorded.getScheduleScore());                    
        backtrack.set(true);
        removeShiftFromDay(scheduleMatrix, scheduleMatrixOriginal, recorded);
        AssignShifts.fillShifts(scheduleMatrix, scheduleMatrixOriginal, workers, recordedShifts, lastRecordedShift, backtrack);
    }
    }
}
