package com.graafik.schedule;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.graafik.model.Shift;
import com.graafik.model.Worker;

public class Quarter {

    public static void QuarterBalance(Shift[][] scheduleMatrix, List<Worker> workers) {

        QuarterLast(scheduleMatrix, workers);
    }

    private static void QuarterLast(Shift[][] scheduleMatrix, List<Worker> workers) {
        List<Worker> filteredWorkers = FilterWorkers(workers);
        if (filteredWorkers.isEmpty()) return;

        for (Worker worker : workers) {
            loop:
            for (Shift[] scheduleMatrix1 : scheduleMatrix) {
                Shift shift = scheduleMatrix1[worker.getEmployeeId()];
                if (shift.getDuration() != 8 || (!shift.getType().equals(Shift.OSAKOND) && !shift.getType().equals(Shift.INTENSIIV)))
                    continue;

                int hoursBalance = worker.getQuarterBalance();

                if (hoursBalance >= 0) {
                    break loop;  // Break the loop if the quarter balance is >= 0
                } else if (hoursBalance == -1) {
                    scheduleMatrix1[worker.getEmployeeId()] = new Shift(9, shift.getType());
                    worker.setQuarterBalance(hoursBalance + 1);
                } else {
                    scheduleMatrix1[worker.getEmployeeId()] = new Shift(10, shift.getType());
                    worker.setQuarterBalance(hoursBalance + 2);
                }
            }
        }

    }

    private static List<Worker> FilterWorkers(List<Worker> workers) {
        var negativeWorkers = workers.stream().filter(w -> w.getQuarterBalance() < 0).collect(Collectors.toList());
        negativeWorkers.sort(Comparator.comparingDouble(Worker::getQuarterBalance));
        return negativeWorkers;
    }
}