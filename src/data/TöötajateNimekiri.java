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
        Worker helve = new Worker(0, "Helve", 168, 1.0, -6, 0, helvePuhkusePäevad, helveSooviPuhkepäevad,
                helveSooviTööpäevad, helveHaiguslehePäevad);
        töötajateNimekiri.add(helve);

        // KAI
        List<Integer> kaiPuhkusePäevad = new ArrayList<>();
        List<Integer> kaiSooviPuhkepäevad = new ArrayList<>(Arrays.asList(27, 28, 29, 30));
        HashMap<Integer, Shift> kaiSooviTööpäevad = new HashMap<>();
        List<Integer> kaiHaiguslehePäevad = new ArrayList<>();
        Worker kai = new Worker(1, "Kai", 168,  1.0, -8, 8, kaiPuhkusePäevad, kaiSooviPuhkepäevad, kaiSooviTööpäevad,
                kaiHaiguslehePäevad);
        töötajateNimekiri.add(kai);

        // KAJA
        List<Integer> kajaPuhkusePäevad = new ArrayList<>();
        List<Integer> kajaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> kajaSooviTööpäevad = new HashMap<>();
        List<Integer> kajaHaiguslehePäevad = new ArrayList<>();
        Worker kaja = new Worker(2, "Kaja", 168,  1.0, -6, 0, kajaPuhkusePäevad, kajaSooviPuhkePäevad, kajaSooviTööpäevad,
                kajaHaiguslehePäevad);
        töötajateNimekiri.add(kaja);

        // MARI-LIIS
        List<Integer> mariliisPuhkusePäevad = new ArrayList<>();
        List<Integer> mariliisSooviPuhkePäevad = new ArrayList<>(Arrays.asList(10));
        HashMap<Integer, Shift> mariliisSooviTööpäevad = new HashMap<>();
        List<Integer> mariliisHaiguslehePäevad = new ArrayList<>();
        Worker mariliis = new Worker(3, "Mari-Liis", 168,  1.0, -12, 0, mariliisPuhkusePäevad, mariliisSooviPuhkePäevad,
                mariliisSooviTööpäevad, mariliisHaiguslehePäevad);
        töötajateNimekiri.add(mariliis);

        // Olga
        List<Integer> olgaPuhkusePäevad = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9));
        List<Integer> olgaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(10, 21, 28, 30));
        HashMap<Integer, Shift> olgaSooviTööpäevad = new HashMap<>();
        List<Integer> olgaHaiguslehePäevad = new ArrayList<>();
        Worker olga = new Worker(4, "Olga", 168,  1.0, -8, 0, olgaPuhkusePäevad, olgaSooviPuhkePäevad, olgaSooviTööpäevad,
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
        Worker pärja = new Worker(5, "Pärja", 168,  1.0, -12, 8, pärjaPuhkusePäevad, pärjaSooviPuhkePäevad,
                pärjaSooviTööpäevad, pärjaHaiguslehePäevad);
        töötajateNimekiri.add(pärja);

        // RIMMA
        List<Integer> rimmaPuhkusePäevad = new ArrayList<>();
        List<Integer> rimmaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 30));
        HashMap<Integer, Shift> rimmaSooviTööpäevad = new HashMap<>();
        List<Integer> rimmaHaiguslehePäevad = new ArrayList<>();
        Worker rimma = new Worker(6, "Rimma", 168,  1.0, -2, 0, rimmaPuhkusePäevad, rimmaSooviPuhkePäevad,
                rimmaSooviTööpäevad,
                rimmaHaiguslehePäevad);
        töötajateNimekiri.add(rimma);

        // ester
        List<Integer> esterPuhkusePäevad = new ArrayList<>();
        List<Integer> esterSooviPuhkePäevad = new ArrayList<>(Arrays.asList(2, 3));
        HashMap<Integer, Shift> esterSooviTööpäevad = new HashMap<>();
        List<Integer> esterHaiguslehePäevad = new ArrayList<>();
        Worker ester = new Worker(7, "Ester", 126,  0.75, 4, 0, esterPuhkusePäevad, esterSooviPuhkePäevad,
                esterSooviTööpäevad,
                esterHaiguslehePäevad);
        töötajateNimekiri.add(ester);

        // laine
        List<Integer> lainePuhkusePäevad = new ArrayList<>(Arrays.asList(13, 14, 15, 16, 17, 18, 19, 20, 21, 22));
        List<Integer> laineSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> laineSooviTööpäevad = new HashMap<>();
        List<Integer> laineHaiguslehePäevad = new ArrayList<>();
        Worker laine = new Worker(8, "Laine", 126,  0.75,  -4, 0, lainePuhkusePäevad, laineSooviPuhkePäevad,
                laineSooviTööpäevad,
                laineHaiguslehePäevad);
        töötajateNimekiri.add(laine);

        // natalja
        List<Integer> nataljaPuhkusePäevad = new ArrayList<>();
        List<Integer> nataljaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> nataljaSooviTööpäevad = new HashMap<>();
        List<Integer> nataljaHaiguslehePäevad = new ArrayList<>();
        Worker natalja = new Worker(9, "natalja", 126,  0.75,  -4, 0, nataljaPuhkusePäevad, nataljaSooviPuhkePäevad,
                nataljaSooviTööpäevad,
                nataljaHaiguslehePäevad);
        töötajateNimekiri.add(natalja);

        // reelika
        List<Integer> reelikaPuhkusePäevad = new ArrayList<>();
        List<Integer> reelikaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> reelikaSooviTööpäevad = new HashMap<>();
        List<Integer> reelikaHaiguslehePäevad = new ArrayList<>();
        Worker reelika = new Worker(10, "reelika", 126,  0.75,  -10, 0, reelikaPuhkusePäevad, reelikaSooviPuhkePäevad,
                reelikaSooviTööpäevad,
                reelikaHaiguslehePäevad);
        töötajateNimekiri.add(reelika);

        // tiina
        List<Integer> tiinaPuhkusePäevad = new ArrayList<>(Arrays.asList(23, 24, 25, 26, 27, 28, 29, 30));
        List<Integer> tiinaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(1, 5, 16));
        HashMap<Integer, Shift> tiinaSooviTööpäevad = new HashMap<>();
        List<Integer> tiinaHaiguslehePäevad = new ArrayList<>();
        Worker tiina = new Worker(11, "tiina", 126,  0.75,  -4, 0, tiinaPuhkusePäevad, tiinaSooviPuhkePäevad,
                tiinaSooviTööpäevad,
                tiinaHaiguslehePäevad);
        töötajateNimekiri.add(tiina);

        // anna_k_m
        List<Integer> anna_k_mPuhkusePäevad = new ArrayList<>();
        List<Integer> anna_k_mSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> anna_k_mSooviTööpäevad = new HashMap<>(Map.of(
            19, new Shift(24, Shift.OSAKOND)));
        List<Integer> anna_k_mHaiguslehePäevad = new ArrayList<>();
        Worker anna_k_m = new Worker(12, "anna_k_m", 84,  0.5,  -6, 0, anna_k_mPuhkusePäevad, anna_k_mSooviPuhkePäevad,
                anna_k_mSooviTööpäevad,
                anna_k_mHaiguslehePäevad);
        töötajateNimekiri.add(anna_k_m);
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