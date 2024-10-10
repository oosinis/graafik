package com.backend.graafik.schedule;

import java.util.List;
import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

public class AddForbiddenDays {

    public static void addForbiddenDays(List<Worker> workers, Shift[][] scheduleMatrix) {
        for (Worker worker : workers) {
            if (worker.getLastMonthLastDayHours() == 8) {
                scheduleMatrix[0][worker.getEmployeeId()] = new Shift(8, Shift.INTENSIIV);
                scheduleMatrix[1][worker.getEmployeeId()] = new Shift(0, Shift.KEELATUD);
            }
        }

        for (int personIndex = 0; personIndex < scheduleMatrix[0].length; personIndex++) {
            if (workers.get(personIndex).getLastMonthLastDayHours() == 8) {
                scheduleMatrix[1][personIndex] = new Shift(0, Shift.KEELATUD);
                scheduleMatrix[2][personIndex] = new Shift(0, Shift.KEELATUD);
            }
        }

        for (int i = 1; i < scheduleMatrix.length; i++) {
            for (int personIndex = 0; personIndex < scheduleMatrix[i].length; personIndex++) {
                if (i == scheduleMatrix.length - 1) continue;
                
                if (scheduleMatrix[i][personIndex].getDuration() == 24) {
                    scheduleMatrix[i + 1][personIndex] = new Shift(0, Shift.KEELATUD);
                    if (i == scheduleMatrix.length - 2 || scheduleMatrix[i + 2][personIndex].getDuration() != 0) continue;
                    scheduleMatrix[i + 2][personIndex] = new Shift(0, Shift.KEELATUD);
                }
            }
        }
    }
}