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
        String[][] scheduleMatrix = new String[daysInMonth][töötajateNimekiri.size()];

        for (int i = 0; i < daysInMonth; i++) {
            Arrays.fill(scheduleMatrix[i], "");
        }

        // Step 1 fill worker wishes
        for (Worker töötaja : töötajateNimekiri) {
            assignShifts(töötaja, scheduleMatrix);
        }

        // Siin Reegel 2 kas iga paev töötab 2 inimest
        for (int i = 0; i < daysInMonth; i++) {
            List<String> yesterDay = null;
            if (i != 0) yesterDay = Arrays.asList(scheduleMatrix[i-1]);
            var today = Arrays.asList(scheduleMatrix[i]);
            // Siia vaja teha check et kui daysinmont on saavutatud ss ei saa vota järgmist päeva kui rohkem päevi pole
            var tomorrow = Arrays.asList(scheduleMatrix[i + 1]);
            var includes24 = today.contains("24");
            var includes12 = today.contains("12");
            
            if (!includes24) {
                for (int personIndex = 0; personIndex < today.size(); personIndex++) {
                    String yesterdayShift = null;
                    if (i != 0) yesterdayShift = yesterDay.get(personIndex);
                    var todayShift = today.get(personIndex);
                    var tomorrowShift = tomorrow.get(personIndex);
                    // Reegel 1 check et eelmine päev polnud 24h ja järka päev kah
                    if (yesterdayShift != "24" && todayShift.equals("") && tomorrowShift != "24") {
                        scheduleMatrix[i][personIndex] =  "24";
                        break;
                    }
                }
            }

            if (!includes12) {
                for (int personIndex = 0; personIndex < today.size(); personIndex++) {
                    String yesterdayShift = null;
                    if (i != 0) yesterdayShift = yesterDay.get(personIndex);
                    var todayShift = today.get(personIndex);
                    var tomorrowShift = tomorrow.get(personIndex);
                    // Reegel 1 check et eelmine päev polnud 24h ja järka päev kah
                    if (yesterdayShift != "24" && todayShift.equals("") && tomorrowShift != "24") {
                        scheduleMatrix[i][personIndex] =  "12";
                        break;
                    }
                }
            }

        }

        printSchedule(scheduleMatrix, töötajateNimekiri);
    }

    private static void assignShifts(Worker töötaja, String[][] scheduleMatrix) {
        List<Integer> desiredVacationDays = töötaja.getSooviPuhkePäevad();
        HashMap<Integer, Shift> desiredWorkDays = töötaja.getSooviTööPäevad();
        List<Integer> vacationDays = töötaja.getPuhkusePäevad();

        // Loogika mida töötaja tahab

        // Workdays
        for (Map.Entry<Integer, Shift> entry : desiredWorkDays.entrySet()) {
            int day = entry.getKey() - 1; // 0-based index
            scheduleMatrix[day][töötaja.getEmployeeId()] = String.valueOf(entry.getValue().getDuration());
        }

        // Vacation Days
        for (Integer vacationDay : vacationDays) {
            scheduleMatrix[vacationDay - 1][töötaja.getEmployeeId()] = "P";
        }

        // Desired Vacation Days
        for (Integer dayOff : desiredVacationDays) {
            scheduleMatrix[dayOff - 1][töötaja.getEmployeeId()] = "D";
        }
    }

    private static void checkConstraints(String[][] scheduleMatrix) {
        // Loogika mida tööandja nõuab, ehk nö constraints
        // 1. Peale 24h vahtust oleks päev vaba
        // 2. Teatud arv töötajaid tööl, nt hetkel võiks teha 2 kuna töötajaid 4
        // 3. Reeglite tugevus vms ehk, 
        // 3.1 oluline nt et peale 24h vahetust järka päev vaba.
        // 3.2 oluline et miinimum arv töötajaid oleks tööl
        // 3.3 puhkepäevad peavad olema tagatud ehk P
        // 3.4 soovitud puhkepäevad antakse siis kui 3.2 päeva kohta täidetud
        // ja ss mingit hinnet vaja v mitu graafikut ja ss hinnete võrdlus?
        // Loeks failist
        // Output faili
    }

    private static void printSchedule(String[][] scheduleMatrix, List<Worker> töötajateNimekiri) {
        for (int day = 0; day < scheduleMatrix.length; day++) {
            System.out.print("Day " + (day + 1) + ": ");
            for (int emp = 0; emp < scheduleMatrix[day].length; emp++) {
                System.out.print(töötajateNimekiri.get(emp).getNimi() + ": ");
                System.out.print(scheduleMatrix[day][emp] + " ");
            }
            System.out.println();
        }
    }
}
