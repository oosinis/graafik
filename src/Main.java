import data.*;
import objects.Töötaja;
import objects.TöötajaVahetus;
import objects.Vahetus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class Main {
    public static void printGraafikByDay(TöötajaVahetus[][] graafik, List<Töötaja> töötajad) {
        System.out.println("Day-wise Schedule:");
        for (int day = 0; day < graafik.length; day++) {
            System.out.print("Day " + (day + 1) + ": ");
            for (int employeeIndex = 0; employeeIndex < graafik[day].length; employeeIndex++) {
                TöötajaVahetus vahetus = graafik[day][employeeIndex];
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
    public static void printGraafikByEmployee(TöötajaVahetus[][] graafik, List<Töötaja> töötajad) {
        System.out.println("Employee-wise Schedule:");
        for (int employeeIndex = 0; employeeIndex < töötajad.size(); employeeIndex++) {
            Töötaja töötaja = töötajad.get(employeeIndex);
            System.out.print(töötaja.getNimi() + ": ");
            for (int day = 0; day < graafik.length; day++) {
                TöötajaVahetus vahetus = graafik[day][employeeIndex];
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
        List<Töötaja> töötajad = töötajateNimekiriInstance.getTöötajateNimekiri();

        TöötajaVahetus[][] tühiGraafik = GraafikuLoogika.createTühiGraafik(kuuPikkus, töötajad);
        TöötajaVahetus[][] sooviGraafik = GraafikuLoogika.createSooviGraafik(kuuPikkus, töötajad);

        HashMap<Töötaja, HashMap<Integer, Vahetus>> abi = new HashMap<>();

        TöötajateGraafik töötajateGraafik = new TöötajateGraafik(abi);

        List<KirjaPandudVahetus> kirjaPandudVahetused = new ArrayList<>();


        HashMap <Integer, List<Vahetus>> vahetusteNimekiri = GraafikuLoogika.createVahetusteList(kuuPikkus);

        List<TöötajaVahetus[][]> parimadGraafikud = new ArrayList<>();
        TöötajaVahetus[][] parimGraafik = new TöötajaVahetus[0][0];
        GraafikuLoogika.rekursioon(kirjaPandudVahetused, tühiGraafik, parimGraafik, töötajateGraafik, töötajad, vahetusteNimekiri, parimadGraafikud, 0, -100, 0, kuuPikkus, false);

        for (TöötajaVahetus[][] graafik : parimadGraafikud) {
            printGraafikByDay(graafik, töötajad);
        }

    }
}