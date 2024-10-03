package data;

import java.util.*;
import objects.Shift;
import objects.Worker;

public class WorkersList {
    private List<Worker> workersList = new ArrayList<>();

    public WorkersList() {
        // HELVE
        List<Integer> helveVacationDays = new ArrayList<>();
        ArrayList<Integer> helveDesiredVacationDays = new ArrayList<>(Arrays.asList(16,31));
        HashMap<Integer, Shift> helveDesiredWorkDays = new HashMap<>();
        List<Integer> helveSickDays = new ArrayList<>();
        List<Integer> helveTrainingDays = new ArrayList<>(List.of(10));
        Worker helve = new Worker(0, "Helve", 184, 1.0, 0, 0, helveVacationDays, helveDesiredVacationDays,
                helveDesiredWorkDays, helveSickDays, helveTrainingDays);
        workersList.add(helve);

        // KAI
        List<Integer> kaiVacationDays = new ArrayList<>();
        List<Integer> kaiDesiredVacationDays = new ArrayList<>(Arrays.asList(1,2,3,4,5,6,16,17));
        HashMap<Integer, Shift> kaiDesiredWorkDays = new HashMap<>(Map.of(
                31, new Shift(16, Shift.INTENSIIV)));
        List<Integer> kaiSickDays = new ArrayList<>();
        List<Integer> kaiTrainingDays = new ArrayList<>(List.of(10));
        Worker kai = new Worker(1, "Kai", 184 - 8, 1.0, 0, 0, kaiVacationDays, kaiDesiredVacationDays, kaiDesiredWorkDays,
                kaiSickDays, kaiTrainingDays);
        workersList.add(kai);

        // KAJA
        List<Integer> kajaVacationDays = new ArrayList<>();
        List<Integer> kajaDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> kajaDesiredWorkDays = new HashMap<>();
        List<Integer> kajaSickDays = new ArrayList<>();
        List<Integer> kajaTrainingDays = new ArrayList<>();
        Worker kaja = new Worker(2, "Kaja", 184, 1.0, 0, 8, kajaVacationDays, kajaDesiredVacationDays,
                kajaDesiredWorkDays,
                kajaSickDays, kajaTrainingDays);
        workersList.add(kaja);

        // MARI-LIIS
        List<Integer> mariliisVacationDays = new ArrayList<>();
        List<Integer> mariliisDesiredVacationDays = new ArrayList<>(Arrays.asList(1,5,6,19,20,26,30,31));
        HashMap<Integer, Shift> mariliisDesiredWorkDays = new HashMap<>();
        List<Integer> mariliisSickDays = new ArrayList<>();
        List<Integer> mariliisTrainingDays = new ArrayList<>();
        Worker mariliis = new Worker(3, "Mari-Liis", 184, 1.0, 0, 0, mariliisVacationDays, mariliisDesiredVacationDays,
                mariliisDesiredWorkDays, mariliisSickDays, mariliisTrainingDays);
        workersList.add(mariliis);

        // Olga
        List<Integer> olgaVacationDays = new ArrayList<>();
        List<Integer> olgaDesiredVacationDays = new ArrayList<>(Arrays.asList(5,6,19,20,30,31));
        HashMap<Integer, Shift> olgaDesiredWorkDays = new HashMap<>();
        List<Integer> olgaSickDays = new ArrayList<>();
        List<Integer> olgaTrainingDays = new ArrayList<>(List.of(8));
        Worker olga = new Worker(4, "Olga", 184, 1.0, 0, 0, olgaVacationDays, olgaDesiredVacationDays,
                olgaDesiredWorkDays,
                olgaSickDays, olgaTrainingDays);
        workersList.add(olga);

        // PÄRJA
        List<Integer> pärjaVacationDays = new ArrayList<>();
        List<Integer> pärjaDesiredVacationDays = new ArrayList<>(List.of(31));
        HashMap<Integer, Shift> pärjaDesiredWorkDays = new HashMap<>(Map.of(
                4, new Shift(24, Shift.OSAKOND),
                9, new Shift(24, Shift.OSAKOND),
                16, new Shift(24, Shift.OSAKOND),
                19, new Shift(24, Shift.OSAKOND),
                23, new Shift(24, Shift.OSAKOND),
                26, new Shift(24, Shift.OSAKOND),
                29, new Shift(8, Shift.LÜHIKE_PÄEV)));
        List<Integer> pärjaSickDays = new ArrayList<>();
        List<Integer> pärjaTrainingDays = new ArrayList<>();
        Worker pärja = new Worker(5, "Pärja", 184, 1.0, 0, 8, pärjaVacationDays, pärjaDesiredVacationDays,
                pärjaDesiredWorkDays, pärjaSickDays, pärjaTrainingDays);
        workersList.add(pärja);

        // RIMMA
        List<Integer> rimmaVacationDays = new ArrayList<>();
        List<Integer> rimmaDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> rimmaDesiredWorkDays = new HashMap<>();
        List<Integer> rimmaSickDays = new ArrayList<>();
        List<Integer> rimmaTrainingDays = new ArrayList<>(List.of(8));
        Worker rimma = new Worker(6, "Rimma", 184, 1.0, 0, 0, rimmaVacationDays, rimmaDesiredVacationDays,
                rimmaDesiredWorkDays,
                rimmaSickDays, rimmaTrainingDays);
        workersList.add(rimma);

        // ester
        List<Integer> esterVacationDays = new ArrayList<>();
        List<Integer> esterDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> esterDesiredWorkDays = new HashMap<>();
        List<Integer> esterSickDays = new ArrayList<>();
        List<Integer> esterTrainingDays = new ArrayList<>();
        Worker ester = new Worker(7, "Ester", 138, 0.75, 0, 0, esterVacationDays, esterDesiredVacationDays,
                esterDesiredWorkDays,
                esterSickDays, esterTrainingDays);
        workersList.add(ester);

        // laine
        List<Integer> laineVacationDays = new ArrayList<>();
        List<Integer> laineDesiredVacationDays = new ArrayList<>(Arrays.asList(26, 27));
        HashMap<Integer, Shift> laineDesiredWorkDays = new HashMap<>();
        List<Integer> laineSickDays = new ArrayList<>();
        List<Integer> laineTrainingDays = new ArrayList<>();
        Worker laine = new Worker(8, "Laine", 138, 0.75, 0, 0, laineVacationDays, laineDesiredVacationDays,
                laineDesiredWorkDays,
                laineSickDays, laineTrainingDays);
        workersList.add(laine);

        // natalja
        List<Integer> nataljaVacationDays = new ArrayList<>();
        List<Integer> nataljaDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> nataljaDesiredWorkDays = new HashMap<>();
        List<Integer> nataljaSickDays = new ArrayList<>();
        List<Integer> nataljaTrainingDays = new ArrayList<>();
        Worker natalja = new Worker(9, "natalja", 138, 0.75, 0, 0, nataljaVacationDays, nataljaDesiredVacationDays,
                nataljaDesiredWorkDays, nataljaSickDays, nataljaTrainingDays);
        workersList.add(natalja);

        // reelika
        List<Integer> reelikaVacationDays = new ArrayList<>();
        List<Integer> reelikaDesiredVacationDays = new ArrayList<>(Arrays.asList(13,14,15,16,17,18,19,20));
        HashMap<Integer, Shift> reelikaDesiredWorkDays = new HashMap<>();
        List<Integer> reelikaSickDays = new ArrayList<>();
        List<Integer> reelikaTrainingDays = new ArrayList<>();
        Worker reelika = new Worker(10, "reelika", 138, 0.75, 0, 0, reelikaVacationDays, reelikaDesiredVacationDays,
                reelikaDesiredWorkDays,
                reelikaSickDays, reelikaTrainingDays);
        workersList.add(reelika);

        // tiina
        List<Integer> tiinaVacationDays = new ArrayList<>();
        List<Integer> tiinaDesiredVacationDays = new ArrayList<>(Arrays.asList(11,16,18,24,25));
        HashMap<Integer, Shift> tiinaDesiredWorkDays = new HashMap<>();
        List<Integer> tiinaSickDays = new ArrayList<>(List.of(10));
        List<Integer> tiinaTrainingDays = new ArrayList<>();
        Worker tiina = new Worker(11, "tiina", 138, 0.75, 0, 0, tiinaVacationDays, tiinaDesiredVacationDays,
                tiinaDesiredWorkDays,
                tiinaSickDays, tiinaTrainingDays);
        workersList.add(tiina);

        // nadezda
        List<Integer> nadezdaVacationDays = new ArrayList<>();
        List<Integer> nadezdaDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> nadezdaDesiredWorkDays = new HashMap<>();
        List<Integer> nadezdaSickDays = new ArrayList<>();
        List<Integer> nadezdaTrainingDays = new ArrayList<>(List.of(8));
        Worker nadezda = new Worker(12, "nadezda", 184, 1.0, 0, 0, nadezdaVacationDays, nadezdaDesiredVacationDays,
                nadezdaDesiredWorkDays,
                nadezdaSickDays, nadezdaTrainingDays);
        workersList.add(nadezda);
    }

    // Getter method for the list
    public List<Worker> getWorkersList() {
        return workersList;
    }

}