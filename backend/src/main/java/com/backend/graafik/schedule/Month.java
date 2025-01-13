package com.backend.graafik.schedule;

import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class Month {
    public static void MonthlyBalance(Shift[][] scheduleMatrix, List<Worker> workers) {
        List<Worker> filteredWorkers = FilterWorkers(workers);
        if (filteredWorkers.isEmpty()) return;

        for (Worker worker : workers) {
            loop:
            for (Shift[] scheduleMatrix1 : scheduleMatrix) {
                Shift shift = scheduleMatrix1[worker.getEmployeeId()];
                if (shift.getDuration() != 8 || (!shift.getCategory().equals(Shift.OSAKOND) && !shift.getCategory().equals(Shift.INTENSIIV))) continue;

                int hoursBalance = worker.getQuarterBalance() - worker.getInitialBalance();

                if (hoursBalance >= 0) {
                    break loop;  // Break the loop if the monthly balance is >= 0
                } else if (hoursBalance == -1) {
                    scheduleMatrix1[worker.getEmployeeId()] = new Shift(9, shift.getCategory());
                    worker.setQuarterBalance(hoursBalance + 1 + worker.getInitialBalance());
                } else {
                    scheduleMatrix1[worker.getEmployeeId()] = new Shift(10, shift.getCategory());
                    worker.setQuarterBalance(hoursBalance + 2 + worker.getInitialBalance());
                }
            }
        }
    }

    private static List<Worker> FilterWorkers(List<Worker> workers) {
        var negativeWorkers = workers.stream().filter(w -> w.getQuarterBalance() - w.getInitialBalance() < 0).collect(Collectors.toList());
        negativeWorkers.sort(Comparator.comparingDouble(Worker::getQuarterBalance));
        return negativeWorkers;
    }
}
