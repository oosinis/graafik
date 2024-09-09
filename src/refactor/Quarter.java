package refactor;

import java.util.List;
import objects.Shift;
import objects.Worker;

public class Quarter {
    public static void QuarterLast(Shift[][] scheduleMatrix, List<Worker> workers) {
        List<Worker> filteredWorkers = HelperMethods.FilterWorkers(workers, -1);
        if(filteredWorkers == null) return;

        for (Worker worker : filteredWorkers) {
            loop: for (int dayIndex = 0; dayIndex < scheduleMatrix.length; dayIndex++) {
                Shift shift = scheduleMatrix[dayIndex][worker.getEmployeeId()];
                if (!shift.getCategory().equals(Shift.LÜHIKE_PÄEV))  continue;
            
                switch (worker.getHoursBalance()) {
                    case 0 -> {
                        break loop;
                    }
                    case -1 -> {
                        shift.setDuration(9);
                        worker.setHoursBalance(worker.getHoursBalance() + 1);
                    }
                    default -> {
                        shift.setDuration(10);
                        worker.setHoursBalance(worker.getHoursBalance() + 2);
                    }
                }
            }
        }
    }
}
