package refactor;

import data.TöötajateNimekiri;
import java.util.*;
import objects.Shift;
import objects.Worker;

public class ScheduleCreator {
    // TODO:
    // meetodid oigetesse failidesse
    // MEILIST: puhkuse päevade arvutus nv puhkuse päevad ei lähe arvesse
    // võiks töötada 3x8h päevas --> if  < -8 --> -10 lähme vaatame kuhu saame assigneda yhe 8h juurde ja ss on juba osaliselt täidetud et 3x8 oleks tööl
    // 9 ja 10h vahetused --> nt pikendame 8h vahetusi kui pole kvartali tunnid koos

    // Päeva arvutus
    // Kolmap = 1.SEPT
    // p = 0
    // tahan  mis päev on matrixi x. x==> 3, vaatad maatrixi index on 3 ehk tegelikult kuu 4. päev
    // (x + p) % 7 = y ==> y {0....6} 6 = laup, 0 = pühap 

    public static void main(String[] args) {
        TöötajateNimekiri töötajateNimekiriInstance = new TöötajateNimekiri();
        List<Worker> töötajateNimekiri = töötajateNimekiriInstance.getTöötajateNimekiri();

        int daysInMonth = 30;
        Shift[][] scheduleMatrix = AssignWorkerWishes.initializeScheduleMatrix(daysInMonth, töötajateNimekiri.size());

        // Step 1
        AssignWorkerWishes.assignWorkerWishes(töötajateNimekiri, scheduleMatrix);

        // Step 2 KEELATUD päevad
        AddForbiddenDays(töötajateNimekiri, scheduleMatrix);

        // Step 3 Muuda koormuse põhjal 
        ChangeWorkLoads(töötajateNimekiri);

        // Step 4 fill shifts
        AssignShifts.fillShifts(scheduleMatrix, daysInMonth, töötajateNimekiri);


        // Step 5 kui rahval < -8h jääk siis vaatame kuhu saab neid assginida --> ja assginima ainult tööpäevadle sest nv olemas juba 

        // Step 6 if kvartaliviimane kuu ss lisa meetod et teha vajadusel 8h vahetus --> 10h vahetuseks


        // Export matrix
        printScheduleAndCalculateHours(scheduleMatrix, töötajateNimekiri);
    }

    // TODO: see fail tyhjaks meetoditest oma failidesse, stepide alusel, meetodid mida kasutame igal pool panna helperMethods faili

    public static void ChangeWorkLoads(List<Worker> workers) {
        for (Worker worker : workers) {
            int vacationHrValue;
            double workLoad = worker.getTööKoormus();

            if (workLoad == 0.5) {
                vacationHrValue = 4;
            } else if (workLoad == 0.75) {
                vacationHrValue = 6;
            } else {
                vacationHrValue = 8;
            }

            worker.setTöökoormuseTunnid(
                    worker.getTöökoormuseTunnid() - (worker.getPuhkusePäevad().size() * vacationHrValue));
            worker.setTöökoormuseTunnid(worker.getTöökoormuseTunnid() + worker.getEelmiseKuuÜlejääk());

            for (Map.Entry<Integer, Shift> entry : worker.getSooviTööPäevad().entrySet()) {
                worker.setTöökoormuseTunnid(worker.getTöökoormuseTunnid() - entry.getValue().getDuration());
            }

            if (worker.getEelmiseKuuVahetuseTunnid() == 8)
                worker.setHoursWorked(8);
        }
    }

    public static void AddForbiddenDays(List<Worker> töötajateNimekiri, Shift[][] scheduleMatrix) {
        for (Worker worker : töötajateNimekiri) {
            if (worker.getEelmiseKuuVahetuseTunnid() == 8) {
                scheduleMatrix[0][worker.getEmployeeId()] = new Shift(0, Shift.KEELATUD);
                scheduleMatrix[1][worker.getEmployeeId()] = new Shift(0, Shift.KEELATUD);
            }
        }

        for (int i = 0; i < scheduleMatrix.length; i++) {
            for (int personIndex = 0; personIndex < scheduleMatrix[i].length; personIndex++) {
                if (i == scheduleMatrix.length - 1)
                    continue;
                if (scheduleMatrix[i][personIndex].getDuration() == 24) {
                    scheduleMatrix[i + 1][personIndex] = new Shift(0, Shift.KEELATUD);
                    if (i == scheduleMatrix.length - 2 || scheduleMatrix[i + 2][personIndex].getDuration() != 0)
                        continue;
                    scheduleMatrix[i + 2][personIndex] = new Shift(0, Shift.KEELATUD);
                }
            }
        }
    }

    // Print Schedule and calculate total hours worked by each employee
    private static void printScheduleAndCalculateHours(Shift[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        int[] totalHours = new int[töötajateNimekiri.size()]; // Array to store total hours for each employee

        for (int day = 0; day < scheduleMatrix.length; day++) {
            //System.out.print("Day " + (day + 1) + ": ");
            for (int emp = 0; emp < scheduleMatrix[day].length; emp++) {
                Shift shift = scheduleMatrix[day][emp];

                totalHours[emp] += shift.getDuration();

                System.out.print(töötajateNimekiri.get(emp).getName() + ": " + shift.getCategory() + "| ");
            }
        }

        System.out.println("\nTotal hours worked by each employee:");
        for (int emp = 0; emp < totalHours.length; emp++) {
            System.out.println(töötajateNimekiri.get(emp).getName() + ": " + totalHours[emp] + " hours");
        }

        MatrixToCSV.writeToCSV(scheduleMatrix, "./tulemus.csv", töötajateNimekiri, totalHours);
    }
}