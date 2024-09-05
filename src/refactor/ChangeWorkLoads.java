package refactor;

import objects.Shift;
import objects.Worker;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ChangeWorkLoads {

    public static void ChangeWorkLoads(List<Worker> workers, int firstDayOfMonth) {

        for (Worker worker : workers) {
            int vacationHrValue;
            double workLoad = worker.getWorkLoad();

            if (workLoad == 0.5) {
                vacationHrValue = 4;
            } else if (workLoad == 0.75) {
                vacationHrValue = 6;
            } else {
                vacationHrValue = 8;
            }

            int workerVacationDays = 0;
            for (int date : worker.getVacationDays()) {
                int weekday = HelperMethods.weekdayOfDate(date - 1, firstDayOfMonth);
                if (weekday != 0 && weekday != 6) {
                    workerVacationDays++;
                }
            }

            worker.setWorkLoadHours(
                    worker.getWorkLoadHours() - (workerVacationDays * vacationHrValue+ worker.getLastMonthLastDayHours())),

            worker.setHoursBalanced(worker.getHorsBalanced() - worker.getWorkLoadHours());

            for (Map.Entry<Integer, Shift> entry : worker.getDesiredWorkDays().entrySet()) {
                worker.setWorkLoadHours(worker.getWorkLoadHours() - entry.getValue().getDuration());
                worker.setHoursBalanced(worker.getHorsBalanced() + entry.getValue().getDuration());
            }

            if (worker.getLastMonthLastDayHours() == 8) {
                worker.setHoursWorked(8);
                worker.setHoursBalanced(worker.getHorsBalanced() + 8);
            }
        }
    }
}
