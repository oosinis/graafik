package data;

import java.util.*;
import objects.Shift;
import objects.Worker;

public class TöötajateNimekiri {
    private List<Worker> töötajateNimekiri = new ArrayList<>();

    public TöötajateNimekiri() {
        // HELVE
        List<Integer> helvePuhkusePäevad = new ArrayList<>();
        ArrayList<Integer> helveSooviPuhkepäevad = new ArrayList<>(Arrays.asList(1, 26, 27, 28, 29));
        HashMap<Integer, Shift> helveSooviTööpäevad = new HashMap<>();
        List<Integer> helveHaiguslehePäevad = new ArrayList<>();
        Worker helve = new Worker(0, "Helve", 1.0, -6, 0, helvePuhkusePäevad, helveSooviPuhkepäevad,
                helveSooviTööpäevad, helveHaiguslehePäevad);
        töötajateNimekiri.add(helve);

        // KAI
        List<Integer> kaiPuhkusePäevad = new ArrayList<>();
        List<Integer> kaiSooviPuhkepäevad = new ArrayList<>(Arrays.asList(27, 28, 29, 30));
        HashMap<Integer, Shift> kaiSooviTööpäevad = new HashMap<>();
        List<Integer> kaiHaiguslehePäevad = new ArrayList<>();
        Worker kai = new Worker(1, "Kai", 1.0, -8, 8, kaiPuhkusePäevad, kaiSooviPuhkepäevad, kaiSooviTööpäevad,
                kaiHaiguslehePäevad);
        töötajateNimekiri.add(kai);

        // KAJA
        List<Integer> kajaPuhkusePäevad = new ArrayList<>();
        List<Integer> kajaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> kajaSooviTööpäevad = new HashMap<>();
        List<Integer> kajaHaiguslehePäevad = new ArrayList<>();
        Worker kaja = new Worker(2, "Kaja", 1.0, -8, 0, kajaPuhkusePäevad, kajaSooviPuhkePäevad, kajaSooviTööpäevad,
                kajaHaiguslehePäevad);
        töötajateNimekiri.add(kaja);

        // MARI-LIIS
        List<Integer> mariliisPuhkusePäevad = new ArrayList<>();
        List<Integer> mariliisSooviPuhkePäevad = new ArrayList<>(Arrays.asList(10));
        HashMap<Integer, Shift> mariliisSooviTööpäevad = new HashMap<>();
        List<Integer> mariliisHaiguslehePäevad = new ArrayList<>();
        Worker mariliis = new Worker(3, "Mari-Liis", 1.0, -12, 0, mariliisPuhkusePäevad, mariliisSooviPuhkePäevad,
                mariliisSooviTööpäevad, mariliisHaiguslehePäevad);
        töötajateNimekiri.add(mariliis);

        // Olga
        List<Integer> olgaPuhkusePäevad = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9));
        List<Integer> olgaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(10, 21, 28, 30));
        HashMap<Integer, Shift> olgaSooviTööpäevad = new HashMap<>();
        List<Integer> olgaHaiguslehePäevad = new ArrayList<>();
        Worker olga = new Worker(4, "Olga", 1.0, -8, 0, olgaPuhkusePäevad, olgaSooviPuhkePäevad, olgaSooviTööpäevad,
                olgaHaiguslehePäevad);
        töötajateNimekiri.add(olga);

        // PÄRJA
        List<Integer> pärjaPuhkusePäevad = new ArrayList<>();
        List<Integer> pärjaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> pärjaSooviTööpäevad = new HashMap<>(Map.of(
                4, new Shift(24, Shift.OSAKOND),
                7, new Shift(24, Shift.OSAKOND),
                10, new Shift(24, Shift.OSAKOND),
                13, new Shift(24, Shift.OSAKOND),
                21, new Shift(24, Shift.OSAKOND),
                28, new Shift(24, Shift.OSAKOND),
                30, new Shift(24, Shift.OSAKOND)));
        List<Integer> pärjaHaiguslehePäevad = new ArrayList<>();
        Worker pärja = new Worker(5, "Pärja", 1.0, -12, 8, pärjaPuhkusePäevad, pärjaSooviPuhkePäevad,
                pärjaSooviTööpäevad, pärjaHaiguslehePäevad);
        töötajateNimekiri.add(pärja);
    }

    // Getter method for the list
    public List<Worker> getTöötajateNimekiri() {
        return töötajateNimekiri;
    }

    // Setter method for the list
    public void setTöötajateNimekiri(List<Worker> töötajateNimekiri) {
        this.töötajateNimekiri = töötajateNimekiri;
    }
}