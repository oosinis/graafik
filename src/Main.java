import data.*;
import objects.Worker;
import objects.WorkerShift;
import objects.Shift;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class Main {
    public static void printGraafikByDay(WorkerShift[][] graafik, List<Worker> töötajad) {
        System.out.println("Day-wise Schedule:");
        for (int day = 0; day < graafik.length; day++) {
            System.out.print("Day " + (day + 1) + ": ");
            for (int employeeIndex = 0; employeeIndex < graafik[day].length; employeeIndex++) {
                WorkerShift vahetus = graafik[day][employeeIndex];
                if (vahetus != null) {
                    System.out.print(vahetus.getTöötaja().getNimi() + " (" + vahetus.getVahetus().getCategory() + ") ");
                } else {
                    System.out.print("No Shift ");
                }
            }
            System.out.println();
        }
    }

    // Function to print the schedule employee by employee
    public static void printGraafikByEmployee(WorkerShift[][] graafik, List<Worker> töötajad) {
        System.out.println("Employee-wise Schedule:");
        for (int employeeIndex = 0; employeeIndex < töötajad.size(); employeeIndex++) {
            Worker töötaja = töötajad.get(employeeIndex);
            System.out.print(töötaja.getNimi() + ": ");
            for (int day = 0; day < graafik.length; day++) {
                WorkerShift vahetus = graafik[day][employeeIndex];
                if (vahetus != null) {
                    System.out.print("Day " + (day + 1) + " (" + vahetus.getVahetus().getCategory() + ") ");
                } else {
                    System.out.print("Day " + (day + 1) + " (No Shift) ");
                }
            }
            System.out.println();
        }
    }



    public static void main(String[] args) {
        Integer kuuPikkus = 31;
        int[] kuuPäevad = new int[31];

        List<Character> nädalaPäevad = new ArrayList<>(Arrays.asList('E', 'T', 'K', 'N', 'R', 'L', 'P'));
        Character esimenePäev = 'N';

        TöötajateNimekiri töötajateNimekiriInstance = new TöötajateNimekiri();
        List<Worker> töötajad = töötajateNimekiriInstance.getTöötajateNimekiri();

        WorkerShift[][] tühiGraafik = GraafikuLoogika.createTühiGraafik(kuuPikkus, töötajad);
        WorkerShift[][] sooviGraafik = GraafikuLoogika.createSooviGraafik(kuuPikkus, töötajad);

        HashMap<Worker, HashMap<Integer, Shift>> abi = new HashMap<>();

        TöötajateGraafik töötajateGraafik = new TöötajateGraafik(abi);

        List<KirjaPandudVahetus> kirjaPandudVahetused = new ArrayList<>();


        HashMap <Integer, List<Shift>> vahetusteNimekiri = GraafikuLoogika.createVahetusteList(kuuPikkus);

        List<WorkerShift[][]> parimadGraafikud = new ArrayList<>();
        WorkerShift[][] parimGraafik = new WorkerShift[0][0];

        GraafikuLoogika.rekursioon(kirjaPandudVahetused, tühiGraafik, parimGraafik, töötajateGraafik, töötajad, vahetusteNimekiri, parimadGraafikud, 0, -100, 0, kuuPikkus, false);

        for (WorkerShift[][] graafik : parimadGraafikud) {
            printGraafikByDay(graafik, töötajad);
        }

    }
}