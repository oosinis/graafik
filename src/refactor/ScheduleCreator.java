package refactor;

import data.WorkersList;
import java.util.*;
import objects.Shift;
import objects.Worker;

public class ScheduleCreator {
    // TODO:
    // võiks töötada 3x8h päevas --> if  < -8 --> -10 lähme vaatame kuhu saame assigneda yhe 8h juurde ja ss on juba osaliselt täidetud et 3x8 oleks tööl
    // 9 ja 10h vahetused --> nt pikendame 8h vahetusi kui pole kvartali tunnid koos


    public static void main(String[] args) {
        WorkersList workersListInstance = new WorkersList();
        List<Worker> workersList = workersListInstance.getWorkersList();

        int daysInMonth = 30;
        int firstDayOfMonth = 2;
        Shift[][] scheduleMatrix = AssignWorkerWishes.initializeScheduleMatrix(daysInMonth, workersList.size());

        // Step 1
        AssignWorkerWishes.assignWorkerWishes(workersList, scheduleMatrix);

        // Step 2 KEELATUD päevad
        AddForbiddenDays.AddForbiddenDays(workersList, scheduleMatrix);

        // Step 3 Muuda koormuse põhjal 
        ChangeWorkLoads.ChangeWorkLoads(workersList, firstDayOfMonth);

        // Step 4 fill shifts
        AssignShifts.fillShifts(scheduleMatrix, daysInMonth, workersList);

        // Step 5 kui rahval < -8h jääk siis vaatame kuhu saab neid assginida --> ja assginima ainult tööpäevadle sest nv olemas juba
        

        // Step 6 if kvartaliviimane kuu ss lisa meetod et teha vajadusel 8h vahetus --> 10h vahetuseks


        // Export matrix
        VisualizeResults.MatrixToCSV(scheduleMatrix, "./tulemus.csv", workersList);
        VisualizeResults.printSchedule(scheduleMatrix, workersList);
    }
}