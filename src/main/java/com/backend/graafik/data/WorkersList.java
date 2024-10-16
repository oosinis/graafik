package com.backend.graafik.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;

public class WorkersList {
    private final List<Worker> workersList = new ArrayList<>();

    public WorkersList() {
        // HELVE
        List<Integer> helveVacationDays = new ArrayList<>();
        ArrayList<Integer> helveDesiredVacationDays = new ArrayList<>(Arrays.asList(3, 17, 28, 29, 30));
        HashMap<Integer, Shift> helveDesiredWorkDays = new HashMap<>();
        List<Integer> helveSickDays = new ArrayList<>();
        List<Integer> helveTrainingDays = new ArrayList<>(List.of(21));
        Worker helve = new Worker(0, "Helve", 184, 1.0, -9, 0, helveVacationDays, helveDesiredVacationDays,
                helveDesiredWorkDays, helveSickDays, helveTrainingDays);
        workersList.add(helve);

        // KAI
        List<Integer> kaiVacationDays = new ArrayList<>();
        List<Integer> kaiDesiredVacationDays = new ArrayList<>(Arrays.asList(2,3,17,29,30));
        HashMap<Integer, Shift> kaiDesiredWorkDays = new HashMap<>(Map.of(
                4, new Shift(24, Shift.OSAKOND)));
        List<Integer> kaiSickDays = new ArrayList<>();
        List<Integer> kaiTrainingDays = new ArrayList<>(List.of(21));
        Worker kai = new Worker(1, "Kai", 168 - 8, 1.0, -8, 8, kaiVacationDays, kaiDesiredVacationDays, kaiDesiredWorkDays,
                kaiSickDays, kaiTrainingDays);
        workersList.add(kai);

        // KAJA
        List<Integer> kajaVacationDays = new ArrayList<>();
        List<Integer> kajaDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> kajaDesiredWorkDays = new HashMap<>();
        List<Integer> kajaSickDays = new ArrayList<>();
        List<Integer> kajaTrainingDays = new ArrayList<>();
        Worker kaja = new Worker(2, "Kaja", 168, 1.0, -5, 8, kajaVacationDays, kajaDesiredVacationDays,
                kajaDesiredWorkDays,
                kajaSickDays, kajaTrainingDays);
        workersList.add(kaja);

        // MARI-LIIS
        List<Integer> mariliisVacationDays = new ArrayList<>();
        List<Integer> mariliisDesiredVacationDays = new ArrayList<>(Arrays.asList(2,3,9,10,12,13,14,16,22,23,24,30));
        HashMap<Integer, Shift> mariliisDesiredWorkDays = new HashMap<>();
        List<Integer> mariliisSickDays = new ArrayList<>();
        List<Integer> mariliisTrainingDays = new ArrayList<>();
        Worker mariliis = new Worker(3, "Mari-Liis", 168, 1.0, -6, 0, mariliisVacationDays, mariliisDesiredVacationDays,
                mariliisDesiredWorkDays, mariliisSickDays, mariliisTrainingDays);
        workersList.add(mariliis);

        
        // nadezda
        List<Integer> nadezdaVacationDays = new ArrayList<>();
        List<Integer> nadezdaDesiredVacationDays = new ArrayList<>(Arrays.asList(21,28));
        HashMap<Integer, Shift> nadezdaDesiredWorkDays = new HashMap<>();
        List<Integer> nadezdaSickDays = new ArrayList<>();
        List<Integer> nadezdaTrainingDays = new ArrayList<>();
        Worker nadezda = new Worker(4, "nadezda", 168, 1.0, -4, 0, nadezdaVacationDays, nadezdaDesiredVacationDays,
                nadezdaDesiredWorkDays,
                nadezdaSickDays, nadezdaTrainingDays);
        workersList.add(nadezda);

        // Olga
        List<Integer> olgaVacationDays = new ArrayList<>();
        List<Integer> olgaDesiredVacationDays = new ArrayList<>(Arrays.asList(1,2,3));
        HashMap<Integer, Shift> olgaDesiredWorkDays = new HashMap<>();
        List<Integer> olgaSickDays = new ArrayList<>();
        List<Integer> olgaTrainingDays = new ArrayList<>(List.of());
        Worker olga = new Worker(5, "Olga", 184, 1.0, -8, 0, olgaVacationDays, olgaDesiredVacationDays,
                olgaDesiredWorkDays,
                olgaSickDays, olgaTrainingDays);
        workersList.add(olga);

        // PÄRJA
        List<Integer> pärjaVacationDays = new ArrayList<>();
        List<Integer> pärjaDesiredVacationDays = new ArrayList<>(Arrays.asList(1,2,3,23,24));
        HashMap<Integer, Shift> pärjaDesiredWorkDays = new HashMap<>(Map.of(
                4, new Shift(24, Shift.INTENSIIV),
                27, new Shift(24, Shift.OSAKOND),
                29, new Shift(24, Shift.OSAKOND)));
        List<Integer> pärjaSickDays = new ArrayList<>();
        List<Integer> pärjaTrainingDays = new ArrayList<>();
        Worker pärja = new Worker(6, "Pärja", 168, 1.0, -12, 0, pärjaVacationDays, pärjaDesiredVacationDays,
                pärjaDesiredWorkDays, pärjaSickDays, pärjaTrainingDays);
        workersList.add(pärja);

        // RIMMA
        List<Integer> rimmaVacationDays = new ArrayList<>();
        List<Integer> rimmaDesiredVacationDays = new ArrayList<>(List.of(12));
        HashMap<Integer, Shift> rimmaDesiredWorkDays = new HashMap<>();
        List<Integer> rimmaSickDays = new ArrayList<>();
        List<Integer> rimmaTrainingDays = new ArrayList<>();
        Worker rimma = new Worker(7, "Rimma", 168, 1.0, -8, 0, rimmaVacationDays, rimmaDesiredVacationDays,
                rimmaDesiredWorkDays,
                rimmaSickDays, rimmaTrainingDays);
        workersList.add(rimma);

        // ester
        List<Integer> esterVacationDays = new ArrayList<>();
        List<Integer> esterDesiredVacationDays = new ArrayList<>();
        HashMap<Integer, Shift> esterDesiredWorkDays = new HashMap<>();
        List<Integer> esterSickDays = new ArrayList<>();
        List<Integer> esterTrainingDays = new ArrayList<>();
        Worker ester = new Worker(8, "Ester", 126, 0.75, -4, 0, esterVacationDays, esterDesiredVacationDays,
                esterDesiredWorkDays,
                esterSickDays, esterTrainingDays);
        workersList.add(ester);

        // laine
        List<Integer> laineVacationDays = new ArrayList<>();
        List<Integer> laineDesiredVacationDays = new ArrayList<>(Arrays.asList(26, 27));
        HashMap<Integer, Shift> laineDesiredWorkDays = new HashMap<>(Map.of(
                3, new Shift(24, Shift.OSAKOND)));
        for (int i = 15; i < 31; i++) {
            laineDesiredWorkDays.put(i, new Shift(0, Shift.KEELATUD));
        }
        List<Integer> laineSickDays = new ArrayList<>();
        List<Integer> laineTrainingDays = new ArrayList<>();
        Worker laine = new Worker(9, "Laine", 66, 0.75, -6, 0, laineVacationDays, laineDesiredVacationDays,
                laineDesiredWorkDays,
                laineSickDays, laineTrainingDays);
        workersList.add(laine);

        // natalja
        List<Integer> nataljaVacationDays = new ArrayList<>();
        List<Integer> nataljaDesiredVacationDays = new ArrayList<>(List.of(5));
        HashMap<Integer, Shift> nataljaDesiredWorkDays = new HashMap<>();
        List<Integer> nataljaSickDays = new ArrayList<>();
        List<Integer> nataljaTrainingDays = new ArrayList<>();
        Worker natalja = new Worker(10, "natalja", 126, 0.75, -5, 0, nataljaVacationDays, nataljaDesiredVacationDays,
                nataljaDesiredWorkDays, nataljaSickDays, nataljaTrainingDays);
        workersList.add(natalja);

        // reelika
        List<Integer> reelikaVacationDays = new ArrayList<>();
        List<Integer> reelikaDesiredVacationDays = new ArrayList<>(Arrays.asList(3,8,9,10,24,25,30));
        HashMap<Integer, Shift> reelikaDesiredWorkDays = new HashMap<>();
        List<Integer> reelikaSickDays = new ArrayList<>();
        List<Integer> reelikaTrainingDays = new ArrayList<>();
        Worker reelika = new Worker(11, "reelika", 126, 0.75, 0, 0, reelikaVacationDays, reelikaDesiredVacationDays,
                reelikaDesiredWorkDays,
                reelikaSickDays, reelikaTrainingDays);
        workersList.add(reelika);

        // tiina
        List<Integer> tiinaVacationDays = new ArrayList<>(Arrays.asList(7,8,15));
        List<Integer> tiinaDesiredVacationDays = new ArrayList<>(Arrays.asList(2,3,17));
        HashMap<Integer, Shift> tiinaDesiredWorkDays = new HashMap<>();
        List<Integer> tiinaSickDays = new ArrayList<>();
        List<Integer> tiinaTrainingDays = new ArrayList<>(List.of(21));
        Worker tiina = new Worker(12, "tiina", 126, 0.75, -5, 0, tiinaVacationDays, tiinaDesiredVacationDays,
                tiinaDesiredWorkDays,
                tiinaSickDays, tiinaTrainingDays);
        workersList.add(tiina);
    }

    // Getter method for the list
    public List<Worker> getWorkersList() {
        return workersList;
    }

}