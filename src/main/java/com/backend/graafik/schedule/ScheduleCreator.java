package com.backend.graafik.schedule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.backend.graafik.data.WorkersList;
import com.backend.graafik.model.RecordedShift;

import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

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
        boolean lastMonthOfQuarter = true;

        List<RecordedShift> recordedShifts = new ArrayList<>();
        RecordedShift lastRecordedShift = new RecordedShift(0, workersList.get(0), 0);

        int daysInMonth = 31;
        int firstDayOfMonth = 0;
        Shift[][] scheduleMatrixOriginal = AssignWorkerWishes.initializeScheduleMatrix(daysInMonth, workersList.size());

        Shift[][] scheduleMatrix = AssignWorkerWishes.initializeScheduleMatrix(daysInMonth, workersList.size());

        Map<Integer, List<Worker>> unusedWorkers = new HashMap<>();
        for (int i = 0; i < scheduleMatrix.length; i++) {
            List<Worker> workersCopy = new ArrayList<>(workersList);
            unusedWorkers.put(i, workersCopy);
        }

        // Step 1
        AssignWorkerWishes.assignWorkerWishes(workersList, scheduleMatrix);
        AssignWorkerWishes.assignWorkerWishes(workersList, scheduleMatrixOriginal);

        // Step 2 KEELATUD päevad
        AddForbiddenDays.addForbiddenDays(workersList, scheduleMatrix);
        AddForbiddenDays.addForbiddenDays(workersList, scheduleMatrixOriginal);

        // Step 3 Muuda koormuse põhjal
        ChangeWorkLoads.changeWorkLoads(workersList, firstDayOfMonth);

        // Step 4 fill shifts
        AssignShifts.fillShifts(scheduleMatrix, scheduleMatrixOriginal, workersList, recordedShifts, lastRecordedShift, unusedWorkers);


        // Step 5 kui rahval < -8h jääk siis vaatame kuhu saab neid assginida --> ja assgnima ainult tööpäevadle sest nv olemas juba
        AssignExtraShifts.addExtraShifts(scheduleMatrix, daysInMonth, workersList, firstDayOfMonth);

        // Step 6 if kvartaliviimane kuu ss lisa meetod et teha vajadusel 8h vahetus --> 10h vahetuseks
        if (lastMonthOfQuarter) Quarter.QuarterBalance(scheduleMatrix, workersList);
        else Month.MonthlyBalance(scheduleMatrix, workersList);
        

        // Deal with Edgecases

        // Export matrix
        VisualizeResults.MatrixToCSV(scheduleMatrix, "./tulemus.csv", workersList);


    }
}