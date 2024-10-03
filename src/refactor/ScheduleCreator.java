package refactor;

import data.WorkersList;
import java.util.*;
import objects.Shift;
import objects.Worker;

public class ScheduleCreator {
    //TODO: Edgecases
    // Case 1 --> End of quarter worker has +6 or +7. if worker has 2 8hr shifts, remove 1 and increase the other to 10, 
    // removed shift check if someone is missing 8-10 hrs and try to assign first on same day if cant then on other day for the same worker

    // Case 2 --> End of quarter is -7, check if has 10hr or 9hr shift, take -1hr and add somewhere +8hr shift
    
    // Case 3 --> End of quarter is -4, check if has 2x10hr shifts, change them to 8hr and add 1 more 8hr shift

    // Case 4 --> End of quarter is +4 ?

    // Case 5 --> End of quarter is +2 ?

    public static void main(String[] args) {

        WorkersList workersListInstance = new WorkersList();
        List<Worker> workersList = workersListInstance.getWorkersList();
        boolean lastMonthOfQuarter = false;

        int daysInMonth = 31;
        int firstDayOfMonth = 2;
        Shift[][] scheduleMatrix = AssignWorkerWishes.initializeScheduleMatrix(daysInMonth, workersList.size());

        // Step 1
        AssignWorkerWishes.assignWorkerWishes(workersList, scheduleMatrix);

        // Step 2 KEELATUD päevad
        AddForbiddenDays.addForbiddenDays(workersList, scheduleMatrix);

        // Step 3 Muuda koormuse põhjal
        ChangeWorkLoads.changeWorkLoads(workersList, firstDayOfMonth);

        // Step 4 fill shifts
        AssignShifts.fillShifts(scheduleMatrix, daysInMonth, workersList);

        // Step 5 kui rahval < -8h jääk siis vaatame kuhu saab neid assginida --> ja assginima ainult tööpäevadle sest nv olemas juba
        AssignExtraShifts.addExtraShifts(scheduleMatrix, daysInMonth, workersList, firstDayOfMonth);

        // Step 6 if kvartaliviimane kuu ss lisa meetod et teha vajadusel 8h vahetus --> 10h vahetuseks
        if (lastMonthOfQuarter) Quarter.QuarterBalance(scheduleMatrix, workersList);
        

        // Deal with Edgecases

        // Export matrix
        VisualizeResults.MatrixToCSV(scheduleMatrix, "./tulemus.csv", workersList);
        VisualizeResults.printSchedule(scheduleMatrix, workersList);

    }
}