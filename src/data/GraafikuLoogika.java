package data;

import objects.Worker;
import objects.WorkerShift;
import objects.Shift;

import java.util.*;

public class GraafikuLoogika {

    int kuuPikkus;
    int[] kuuPäevad;
    Character esimenePäev;
    List<Worker> töötajad;
    List<Character> nädalaPäevad = new ArrayList<>(Arrays.asList('E', 'T', 'K', 'N', 'R', 'L', 'P'));


    public static WorkerShift[][] createTühiGraafik(int kuuPikkus, List<Worker> töötajad) {
        WorkerShift[][] tühiGraafik = new WorkerShift[kuuPikkus][töötajad.size()];
        return tühiGraafik;
    }

    public static WorkerShift[][] createSooviGraafik(int kuuPikkus, List<Worker> töötajad) {
        WorkerShift[][] sooviGraafik = new WorkerShift[kuuPikkus][töötajad.size()];

        for (int i = 0; i < töötajad.size(); i++) {
            Worker töötaja = töötajad.get(i);
            HashMap<Integer, Shift> sooviTööPäevad = töötaja.getSooviTööPäevad();
            for (Map.Entry<Integer, Shift> entry : sooviTööPäevad.entrySet()) {
                int kuupäev = entry.getKey() - 1;
                Shift vahetus = entry.getValue();
                sooviGraafik[kuupäev][i] = new WorkerShift(vahetus, töötaja);
            }
        }
        return sooviGraafik;
    }

    public static HashMap<Integer, List<Shift>> createVahetusteList(int kuuPikus) {
        HashMap<Integer, List<Shift>> tööpäevaVahetus = new HashMap<>();
        for (int i = 0; i < kuuPikus; i++) {
            tööpäevaVahetus.put(i, new TööpäevaVahetus().tööpäevaVahetus);
        }
        return tööpäevaVahetus;
    }

    private static int getHindemuutus(int kuupäev, Worker töötaja, Shift vahetus) {
        int muutus = 0;
        if (töötaja.getPuhkusePäevad().contains(kuupäev)) muutus = -50;
        else if (töötaja.getSooviPuhkePäevad().contains(kuupäev)) muutus = -25;
        else if (töötaja.getSooviTööPäevad().containsKey(kuupäev) & töötaja.getSooviTööPäevad().get(kuupäev) == vahetus) muutus = 20;

        return muutus;
    }

    private static void lisaVahetusNimekirja(List<KirjaPandudVahetus> kirjaPandudVahetused,
                                             WorkerShift[][] tühiGraafik,
                                             TöötajateGraafik töötajateGraafik,
                                             HashMap<Integer, List<Shift>> vahetusteList,
                                             int kuupäev,
                                             Worker töötaja,
                                             int hindeMuutus,
                                             int praeguneHinne,
                                             Shift vahetus
    ) {

        tühiGraafik[kuupäev][töötaja.getEmployeeId()] = new WorkerShift(vahetus, töötaja);
        kirjaPandudVahetused.add(new KirjaPandudVahetus(kuupäev, töötaja, vahetus, hindeMuutus));

        töötajateGraafik.addToTöötajaGraafik(töötaja, kuupäev, vahetus);

        List<Shift> vahetusedForDay = vahetusteList.get(kuupäev);
        if (vahetusedForDay != null) {
            vahetusedForDay.remove(vahetus);
        } else {
            System.out.println("Seda vahetust polnud sel päeval !!" + vahetus + kuupäev);
        }

        praeguneHinne += hindeMuutus;
    }

    private static void eemaldaVahetusNimekirjast(List<KirjaPandudVahetus> kirjaPandudVahetused,
                                                  WorkerShift[][] tühiGraafik,
                                                  TöötajateGraafik töötajateGraafik,
                                                  HashMap<Integer, List<Shift>> vahetusteList,
                                                  int kuupäev,
                                                  Worker töötaja,
                                                  int hindeMuutus,
                                                  int praeguneHinne,
                                                  Shift vahetus) {

        tühiGraafik[kuupäev][töötaja.getEmployeeId()] = null;
        kirjaPandudVahetused.remove(kirjaPandudVahetused.size() - 1);
        töötajateGraafik.removeFromTöötajateGraafik(töötaja, kuupäev);
        vahetusteList.get(kuupäev).add(vahetus);
        praeguneHinne -= hindeMuutus;
    }

    private static Boolean kasJubaTöölKirjas(int kuupäev, Worker töötaja, TöötajateGraafik töötajateGraafik) {
        if (töötajateGraafik.containsKey(töötaja)) {
            return töötajateGraafik.get(töötaja).containsKey(kuupäev);
        } return false;
    }

    private static Boolean kasTöötajaVaba(int kuupäev, Worker töötaja) {
        if (töötaja.getHaiguslehePäevad().contains(kuupäev)) return false;
        return true;
    }

    private static Boolean kasPiirangudKehtivad() {
        return true;
    }

    public static void rekursioon(
            List<KirjaPandudVahetus> kirjaPandudVahetused,
            WorkerShift[][] tühiGraafik,
            WorkerShift[][] parimGraafik,
            TöötajateGraafik töötajateGraafik,
            List<Worker> töötajateNimekiri,
            HashMap<Integer, List<Shift>> vahetusteList,
            List<WorkerShift[][]> parimadGraafikud,
            int praeguneHinne,
            int parimHinne,
            int kuupäev,
            int kuuPikkus,
            Boolean alustatud
    ) {

        if (kuupäev == kuuPikkus) {
            if (praeguneHinne > parimHinne) {
                parimHinne = praeguneHinne;
                parimGraafik = tühiGraafik;
                parimadGraafikud = new ArrayList<>();
                parimadGraafikud.add(parimGraafik);
            } else if (praeguneHinne == parimHinne) {
                parimadGraafikud.add(tühiGraafik);
            }
            return;
        }

        // kui on tagasi täiesti alguses siis quit
        if (kuupäev == 0 && vahetusteList.get(kuupäev).size() == 3 && alustatud) {
            return;
        } else {
            alustatud = true;
        }

        if (vahetusteList.get(kuupäev).size() == 0) {
            rekursioon(kirjaPandudVahetused, tühiGraafik, parimGraafik, töötajateGraafik, töötajateNimekiri, vahetusteList, parimadGraafikud, praeguneHinne, parimHinne, kuupäev++, alustatud);
            return;
        }
        Shift vahetus = vahetusteList.get(kuupäev).get(0);

        // suur loop kõige ümber
        for (Worker töötaja : töötajateNimekiri) {

            // TODO kas juba kirjas
            if (kasJubaTöölKirjas(kuupäev, töötaja, töötajateGraafik)) return;
            // TODO kas vaba
            if (!kasTöötajaVaba(kuupäev, töötaja)) return;
            // TODO piirangud
            if (!kasPiirangudKehtivad()) return;

            int hindeMuutus = getHindemuutus(kuupäev, töötaja, vahetus);

            lisaVahetusNimekirja(kirjaPandudVahetused, tühiGraafik, töötajateGraafik, vahetusteList, kuupäev, töötaja, hindeMuutus, praeguneHinne, vahetus);
            rekursioon(kirjaPandudVahetused, tühiGraafik, parimGraafik, töötajateGraafik, töötajateNimekiri, vahetusteList, parimadGraafikud, praeguneHinne, parimHinne, kuupäev, alustatud);
            eemaldaVahetusNimekirjast(kirjaPandudVahetused, tühiGraafik, töötajateGraafik, vahetusteList, kuupäev, töötaja, hindeMuutus, praeguneHinne, vahetus);
        }

    }

}
