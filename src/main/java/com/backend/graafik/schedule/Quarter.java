package com.backend.graafik.schedule;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

public class Quarter {

    public static void QuarterBalance(Shift[][] scheduleMatrix, List<Worker> workers) {

        QuarterLast(scheduleMatrix, workers);
    }

    private static void QuarterLast(Shift[][] scheduleMatrix, List<Worker> workers) {
        List<Worker> filteredWorkers = FilterWorkers(workers);
        if (filteredWorkers.isEmpty()) return;

        for (Worker worker : workers) {
            loop: for (Shift[] scheduleMatrix1 : scheduleMatrix) {
                Shift shift = scheduleMatrix1[worker.getEmployeeId()];
                if (!shift.getCategory().equals(Shift.LÜHIKE_PÄEV))  continue;
                switch (worker.getHoursBalance()) {
                    case 0 -> {
                        break loop;
                    }
                    case -1 -> {
                        scheduleMatrix1[worker.getEmployeeId()] = new Shift(9, Shift.LÜHIKE_PÄEV);
                        worker.setHoursBalance(worker.getHoursBalance() + 1);
                        worker.setHoursBalance(worker.getHoursBalance() + 1);
                        break;
                    }
                    case -10 -> {
                        
                    }
                    default -> {
                        scheduleMatrix1[worker.getEmployeeId()] = new Shift(10, Shift.LÜHIKE_PÄEV);
                        worker.setHoursBalance(worker.getHoursBalance() + 2);
                        worker.setHoursBalance(worker.getHoursBalance() + 2);
                        break;
                    }
                }
            }
        }
    }

    private static List<Worker> FilterWorkers(List<Worker> workers) {
        var negativeWorkers = workers.stream().filter(w -> w.getHoursBalance() < 0).collect(Collectors.toList());
        negativeWorkers.sort(Comparator.comparingDouble(Worker::getHoursBalance));
        return negativeWorkers;
    }
}