package refactor;

import data.TöötajateNimekiri;
import java.util.*;
import objects.Shift;
import objects.Worker;


public class ScheduleCreator {


    public static void main(String[] args) {
        TöötajateNimekiri töötajateNimekiriInstance = new TöötajateNimekiri();
        List<Worker> töötajateNimekiri = töötajateNimekiriInstance.getTöötajateNimekiri();

        int daysInMonth = 30;
        Shift[][] scheduleMatrix = AssignWorkerWishes.initializeScheduleMatrix(daysInMonth, töötajateNimekiri.size());
        
        // Step 1
        AssignWorkerWishes.assignWorkerWishes(töötajateNimekiri, scheduleMatrix);

        // Step 2 KEELATUD päevad
        AddForbiddenDays(töötajateNimekiri, scheduleMatrix);

        ChangeWorkLoads(töötajateNimekiri);

        // Step 3 fill shifts
        AssignShifts.fillShifts(scheduleMatrix, daysInMonth, töötajateNimekiri);

        // Print päevad kus putsus, teated et puudu on 24.10

        // Export matrix
        printScheduleAndCalculateHours(scheduleMatrix, töötajateNimekiri);
    }

    public static void ChangeWorkLoads(List<Worker> workers) {
        for (Worker worker : workers) {
            int vacationHrValue;
            vacationHrValue = switch (worker.getTöökoormus()) {
                case 84 -> 4;
                case 126 -> 6;
                default -> 8;
            };
            worker.setTöökoormus(worker.getTöökoormus() - (worker.getPuhkusePäevad().size() * vacationHrValue));
            worker.setTöökoormus(worker.getTöökoormus() + worker.getEelmiseKuuÜlejääk());
            for (Map.Entry<Integer, Shift> entry : worker.getSooviTööPäevad().entrySet()) {
                worker.setTöökoormus(worker.getTöökoormus() -  entry.getValue().getDuration());
            }
            if (worker.getEelmiseKuuVahetuseTunnid() == 8) worker.setHoursWorked(8);
        }
    }

    public static void AddForbiddenDays(List<Worker> töötajateNimekiri, Shift[][] scheduleMatrix) {
        for (Worker worker : töötajateNimekiri) {
            // ei tea kas on intensiivis, aga otseselt pole vahet
            if (worker.getEelmiseKuuVahetuseTunnid() == 8) {
                scheduleMatrix[0][worker.getEmployeeId()] = new Shift(0, Shift.KEELATUD);
                scheduleMatrix[1][worker.getEmployeeId()] = new Shift(0, Shift.KEELATUD);
            }
        }
        for (int i = 0; i < scheduleMatrix.length; i++) {
            for (int personIndex = 0; personIndex < scheduleMatrix[i].length; personIndex++) {
                if(i == scheduleMatrix.length - 1) continue;
                if(scheduleMatrix[i][personIndex].getDuration() == 24) {
                    scheduleMatrix[i + 1][personIndex] = new Shift(0, Shift.KEELATUD);
                    if(i == scheduleMatrix.length - 2 || scheduleMatrix[i + 2][personIndex].getDuration() != 0) continue;
                    scheduleMatrix[i + 2][personIndex] = new Shift(0, Shift.KEELATUD);
                }
            }
        }
    }

    // Print Schedule and calculate total hours worked by each employee
    private static void printScheduleAndCalculateHours(Shift[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        int[] totalHours = new int[töötajateNimekiri.size()]; // Array to store total hours for each employee

        for (int day = 0; day < scheduleMatrix.length; day++) {
            System.out.print("Day " + (day + 1) + ": ");
            for (int emp = 0; emp < scheduleMatrix[day].length; emp++) {
                Shift shift = scheduleMatrix[day][emp];

                totalHours[emp] += shift.getDuration(); // Add shift duration to the employee's total hours

                System.out.print(töötajateNimekiri.get(emp).getNimi() + ": " + shift.getCategory() + "| ");
            }
            System.out.println();
        }

        // Print total hours worked by each employee
        System.out.println("\nTotal hours worked by each employee:");
        for (int emp = 0; emp < totalHours.length; emp++) {
            System.out.println(töötajateNimekiri.get(emp).getNimi() + ": " + totalHours[emp] + " hours");
        }
    }
}