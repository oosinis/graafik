package refactor;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import objects.Shift;
import objects.Worker;

public class Quarter {

    public static void QuarterBalance(Shift[][] scheduleMatrix, List<Worker> workers, boolean lastMonthOfQuarter) {

        for (Worker worker : workers) worker.setQuarterHoursBalance(worker.getHoursBalance());

        if (lastMonthOfQuarter) QuarterLast(scheduleMatrix, workers);
    }

    private static void QuarterLast(Shift[][] scheduleMatrix, List<Worker> workers) {
        List<Worker> filteredWorkers = FilterWorkers(workers);
        if (filteredWorkers.isEmpty()) return;

        for (Worker worker : filteredWorkers) {
            loop: for (int dayIndex = 0; dayIndex < scheduleMatrix.length; dayIndex++) {

                Shift shift = scheduleMatrix[dayIndex][worker.getEmployeeId()];
                if (!shift.getCategory().equals(Shift.LÜHIKE_PÄEV))  continue;
            
                switch (worker.getQuarterHoursBalance()) {
                    case 0 -> {
                        break loop;
                    }
                    case -1 -> {
                        scheduleMatrix[dayIndex][worker.getEmployeeId()] = new Shift(9, Shift.LÜHIKE_PÄEV);
                        worker.setQuarterHoursBalance(worker.getQuarterHoursBalance() + 1);
                        worker.setHoursBalance(worker.getHoursBalance() + 1);
                        break;
                    }
                    default -> {
                        scheduleMatrix[dayIndex][worker.getEmployeeId()] = new Shift(10, Shift.LÜHIKE_PÄEV);
                        worker.setQuarterHoursBalance(worker.getQuarterHoursBalance() + 2);
                        worker.setHoursBalance(worker.getHoursBalance() + 2);
                        break;
                    }
                }
            }
        }
    }

    private static List<Worker> FilterWorkers(List<Worker> workers) {
        var negativeWorkers = workers.stream().filter(w -> w.getQuarterHoursBalance() < 0).collect(Collectors.toList());
        negativeWorkers.sort(Comparator.comparingDouble(Worker::getQuarterHoursBalance));
        return negativeWorkers;
    }
}

