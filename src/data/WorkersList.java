package data;

import java.util.*;
import objects.Shift;
import objects.Worker;

public class WorkersList {
    private List<Worker> workersList = new ArrayList<>();

    public WorkersList() {
        // HELVE
        List<Integer> helvePuhkusePäevad = new ArrayList<>();
        ArrayList<Integer> helveSooviPuhkepäevad = new ArrayList<>(Arrays.asList(16,31));
        HashMap<Integer, Shift> helveSooviTööpäevad = new HashMap<>();
        List<Integer> helveHaiguslehePäevad = new ArrayList<>();
        List<Integer> helveTrainingDays = new ArrayList<>(List.of(10));
        Worker helve = new Worker(0, "Helve", 176, 1.0, 0, 0, helvePuhkusePäevad, helveSooviPuhkepäevad,
                helveSooviTööpäevad, helveHaiguslehePäevad, helveTrainingDays);
        workersList.add(helve);

        // KAI
        List<Integer> kaiPuhkusePäevad = new ArrayList<>();
        List<Integer> kaiSooviPuhkepäevad = new ArrayList<>(Arrays.asList(1,2,3,4,5,6,16,17));
        HashMap<Integer, Shift> kaiSooviTööpäevad = new HashMap<>(Map.of(
                31, new Shift(16, Shift.INTENSIIV)));
        List<Integer> kaiHaiguslehePäevad = new ArrayList<>();
        List<Integer> kaiTrainingDays = new ArrayList<>(List.of(10));
        Worker kai = new Worker(1, "Kai", 176, 1.0, 0, 0, kaiPuhkusePäevad, kaiSooviPuhkepäevad, kaiSooviTööpäevad,
                kaiHaiguslehePäevad, kaiTrainingDays);
        workersList.add(kai);

        // KAJA
        List<Integer> kajaPuhkusePäevad = new ArrayList<>();
        List<Integer> kajaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> kajaSooviTööpäevad = new HashMap<>();
        List<Integer> kajaHaiguslehePäevad = new ArrayList<>();
        List<Integer> kajaTrainingDays = new ArrayList<>();
        Worker kaja = new Worker(2, "Kaja", 176, 1.0, 0, 8, kajaPuhkusePäevad, kajaSooviPuhkePäevad,
                kajaSooviTööpäevad,
                kajaHaiguslehePäevad, kajaTrainingDays);
        workersList.add(kaja);

        // MARI-LIIS
        List<Integer> mariliisPuhkusePäevad = new ArrayList<>();
        List<Integer> mariliisSooviPuhkePäevad = new ArrayList<>(Arrays.asList(1,5,6,19,20,26,30,31));
        HashMap<Integer, Shift> mariliisSooviTööpäevad = new HashMap<>();
        List<Integer> mariliisHaiguslehePäevad = new ArrayList<>();
        List<Integer> mariliisTrainingDays = new ArrayList<>();
        Worker mariliis = new Worker(3, "Mari-Liis", 176, 1.0, 0, 0, mariliisPuhkusePäevad, mariliisSooviPuhkePäevad,
                mariliisSooviTööpäevad, mariliisHaiguslehePäevad, mariliisTrainingDays);
        workersList.add(mariliis);

        // Olga
        List<Integer> olgaPuhkusePäevad = new ArrayList<>();
        List<Integer> olgaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(5,6,19,20,30,31));
        HashMap<Integer, Shift> olgaSooviTööpäevad = new HashMap<>();
        List<Integer> olgaHaiguslehePäevad = new ArrayList<>();
        List<Integer> olgaTrainingDays = new ArrayList<>(List.of(8));
        Worker olga = new Worker(4, "Olga", 176, 1.0, 0, 0, olgaPuhkusePäevad, olgaSooviPuhkePäevad,
                olgaSooviTööpäevad,
                olgaHaiguslehePäevad, olgaTrainingDays);
        workersList.add(olga);

        // PÄRJA
        List<Integer> pärjaPuhkusePäevad = new ArrayList<>();
        List<Integer> pärjaSooviPuhkePäevad = new ArrayList<>(List.of(31));
        HashMap<Integer, Shift> pärjaSooviTööpäevad = new HashMap<>(Map.of(
                4, new Shift(24, Shift.OSAKOND),
                9, new Shift(24, Shift.OSAKOND),
                14, new Shift(24, Shift.OSAKOND),
                16, new Shift(24, Shift.OSAKOND),
                19, new Shift(24, Shift.OSAKOND),
                23, new Shift(24, Shift.OSAKOND),
                26, new Shift(24, Shift.OSAKOND),
                29, new Shift(8, Shift.LÜHIKE_PÄEV)));
        List<Integer> pärjaHaiguslehePäevad = new ArrayList<>();
        List<Integer> pärjaTrainingDays = new ArrayList<>();
        Worker pärja = new Worker(5, "Pärja", 176, 1.0, 0, 8, pärjaPuhkusePäevad, pärjaSooviPuhkePäevad,
                pärjaSooviTööpäevad, pärjaHaiguslehePäevad, pärjaTrainingDays);
        workersList.add(pärja);

        // RIMMA
        List<Integer> rimmaPuhkusePäevad = new ArrayList<>();
        List<Integer> rimmaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> rimmaSooviTööpäevad = new HashMap<>();
        List<Integer> rimmaHaiguslehePäevad = new ArrayList<>();
        List<Integer> rimmaTrainingDays = new ArrayList<>(List.of(8));
        Worker rimma = new Worker(6, "Rimma", 176, 1.0, 0, 0, rimmaPuhkusePäevad, rimmaSooviPuhkePäevad,
                rimmaSooviTööpäevad,
                rimmaHaiguslehePäevad, rimmaTrainingDays);
        workersList.add(rimma);

        // ester
        List<Integer> esterPuhkusePäevad = new ArrayList<>();
        List<Integer> esterSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> esterSooviTööpäevad = new HashMap<>();
        List<Integer> esterHaiguslehePäevad = new ArrayList<>();
        List<Integer> esterTrainingDays = new ArrayList<>();
        Worker ester = new Worker(7, "Ester", 132, 0.75, 0, 0, esterPuhkusePäevad, esterSooviPuhkePäevad,
                esterSooviTööpäevad,
                esterHaiguslehePäevad, esterTrainingDays);
        workersList.add(ester);

        // laine
        List<Integer> lainePuhkusePäevad = new ArrayList<>();
        List<Integer> laineSooviPuhkePäevad = new ArrayList<>(Arrays.asList(26, 27));
        HashMap<Integer, Shift> laineSooviTööpäevad = new HashMap<>();
        List<Integer> laineHaiguslehePäevad = new ArrayList<>();
        List<Integer> laineTrainingDays = new ArrayList<>();
        Worker laine = new Worker(8, "Laine", 132, 0.75, 0, 0, lainePuhkusePäevad, laineSooviPuhkePäevad,
                laineSooviTööpäevad,
                laineHaiguslehePäevad, laineTrainingDays);
        workersList.add(laine);

        // natalja
        List<Integer> nataljaPuhkusePäevad = new ArrayList<>();
        List<Integer> nataljaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> nataljaSooviTööpäevad = new HashMap<>();
        List<Integer> nataljaHaiguslehePäevad = new ArrayList<>();
        List<Integer> nataljaTrainingDays = new ArrayList<>();
        Worker natalja = new Worker(9, "natalja", 132, 0.75, 0, 0, nataljaPuhkusePäevad, nataljaSooviPuhkePäevad,
                nataljaSooviTööpäevad, nataljaHaiguslehePäevad, nataljaTrainingDays);
        workersList.add(natalja);

        // reelika
        List<Integer> reelikaPuhkusePäevad = new ArrayList<>();
        List<Integer> reelikaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(13,14,15,16,17,18,19,20));
        HashMap<Integer, Shift> reelikaSooviTööpäevad = new HashMap<>();
        List<Integer> reelikaHaiguslehePäevad = new ArrayList<>();
        List<Integer> reelikaTrainingDays = new ArrayList<>();
        Worker reelika = new Worker(10, "reelika", 88, 0.75, 0, 0, reelikaPuhkusePäevad, reelikaSooviPuhkePäevad,
                reelikaSooviTööpäevad,
                reelikaHaiguslehePäevad, reelikaTrainingDays);
        workersList.add(reelika);

        // tiina
        List<Integer> tiinaPuhkusePäevad = new ArrayList<>();
        List<Integer> tiinaSooviPuhkePäevad = new ArrayList<>(Arrays.asList(11,16,18,24,25));
        HashMap<Integer, Shift> tiinaSooviTööpäevad = new HashMap<>();
        List<Integer> tiinaHaiguslehePäevad = new ArrayList<>(List.of(10));
        List<Integer> tiinaTrainingDays = new ArrayList<>();
        Worker tiina = new Worker(11, "tiina", 132, 0.75, 0, 0, tiinaPuhkusePäevad, tiinaSooviPuhkePäevad,
                tiinaSooviTööpäevad,
                tiinaHaiguslehePäevad, tiinaTrainingDays);
        workersList.add(tiina);

        // nadezda
        List<Integer> nadezdaPuhkusePäevad = new ArrayList<>();
        List<Integer> nadezdaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Shift> nadezdaSooviTööpäevad = new HashMap<>();
        List<Integer> nadezdaHaiguslehePäevad = new ArrayList<>();
        List<Integer> nadezdaTrainingDays = new ArrayList<>(List.of(8));
        Worker nadezda = new Worker(12, "nadezda", 176, 1.0, 0, 0, nadezdaPuhkusePäevad, nadezdaSooviPuhkePäevad,
                nadezdaSooviTööpäevad,
                nadezdaHaiguslehePäevad, nadezdaTrainingDays);
        workersList.add(nadezda);
    }

    // Getter method for the list
    public List<Worker> getWorkersList() {
        return workersList;
    }

}