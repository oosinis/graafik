package data;

import objects.Töötaja;
import objects.TöötajaVahetus;
import objects.Vahetus;

import java.util.*;

public class GraafikuLoogika {

    int kuuPikkus;
    int[] kuuPäevad;
    Character esimenePäev;
    List<Töötaja> töötajad;
    List<Character> nädalaPäevad = new ArrayList<>(Arrays.asList('E', 'T', 'K', 'N', 'R', 'L', 'P'));


    public static TöötajaVahetus[][] createTühiGraafik(int kuuPikkus, List<Töötaja> töötajad) {
        TöötajaVahetus[][] tühiGraafik = new TöötajaVahetus[kuuPikkus][töötajad.size()];
        return tühiGraafik;
    }

    public static TöötajaVahetus[][] createSooviGraafik(int kuuPikkus, List<Töötaja> töötajad) {
        TöötajaVahetus[][] sooviGraafik = new TöötajaVahetus[kuuPikkus][töötajad.size()];

        for (int i = 0; i < töötajad.size(); i++) {
            Töötaja töötaja = töötajad.get(i);
            HashMap<Integer, Vahetus> sooviTööPäevad = töötaja.getSooviTööPäevad();
            for (Map.Entry<Integer, Vahetus> entry : sooviTööPäevad.entrySet()) {
                int kuupäev = entry.getKey() - 1;
                Vahetus vahetus = entry.getValue();
                sooviGraafik[kuupäev][i] = new TöötajaVahetus(vahetus, töötaja);
            }
        }
        return sooviGraafik;
    }

    public static HashMap<Integer, List<Vahetus>> createVahetusteList(int kuuPikus) {
        HashMap<Integer, List<Vahetus>> tööpäevaVahetus = new HashMap<>();
        for (int i = 0; i < kuuPikus; i++) {
            tööpäevaVahetus.put(i, new TööpäevaVahetus().tööpäevaVahetus);
        }
        return tööpäevaVahetus;
    }

    private int getHindemuutus(int kuupäev, Töötaja töötaja, Vahetus vahetus) {
        int muutus = 0;
        if (töötaja.getPuhkusePäevad().contains(kuupäev)) muutus = -50;
        else if (töötaja.getSooviPuhkePäevad().contains(kuupäev)) muutus = -25;
        else if (töötaja.getSooviTööPäevad().containsKey(kuupäev) & töötaja.getSooviTööPäevad().get(kuupäev) == vahetus) muutus = 20;

        return muutus;
    }

    private void lisaVahetusNimekirja(List<KirjaPandudVahetus> kirjaPandudVahetused,
                                      TöötajaVahetus[][] tühiGraafik,
                                      HashMap<Töötaja, HashMap<Integer, Vahetus>> töötajateGraafik,
                                      HashMap<Integer, List<Vahetus>> vahetusteList,
                                      int kuupäev,
                                      Töötaja töötaja,
                                      int hindeMuutus,
                                      int praeguneHinne,
                                      Vahetus vahetus
                                      ) {

        tühiGraafik[kuupäev][töötaja.getEmployeeId()] = new TöötajaVahetus(vahetus, töötaja);
        kirjaPandudVahetused.add(new KirjaPandudVahetus(kuupäev, töötaja, vahetus, hindeMuutus));

        if (!töötajateGraafik.containsKey(töötaja)) { töötajateGraafik.put(töötaja, new HashMap<>()); }
        töötajateGraafik.get(töötaja).put(kuupäev, vahetus);

        List<Vahetus> vahetusedForDay = vahetusteList.get(kuupäev);
        if (vahetusedForDay != null) {
            vahetusedForDay.remove(vahetus);
        } else {
            System.out.println("Seda vahetust polnud sel päeval !!" + vahetus + kuupäev);
        }

        praeguneHinne += hindeMuutus;
    }

    private void eemaldaVahetusNimekirjast(List<KirjaPandudVahetus> kirjaPandudVahetused,
                                           TöötajaVahetus[][] tühiGraafik,
                                           HashMap<Töötaja, HashMap<Integer, Vahetus>> töötajateGraafik,
                                           HashMap<Integer, List<Vahetus>> vahetusteList,
                                           int kuupäev,
                                           Töötaja töötaja,
                                           int hindeMuutus,
                                           int praeguneHinne,
                                           Vahetus vahetus) {

        tühiGraafik[kuupäev][töötaja.getEmployeeId()] = null;
        kirjaPandudVahetused.remove(kirjaPandudVahetused.size() - 1);
        töötajateGraafik.get(töötaja).remove(kuupäev);
        vahetusteList.get(kuupäev).add(vahetus);
        praeguneHinne -= hindeMuutus;
    }

    private Boolean kasJubaTöölKirjas(int kuupäev, Töötaja töötaja, HashMap<Töötaja, HashMap<Integer, Vahetus>> töötajateGraafik) {
        if (töötajateGraafik.containsKey(töötaja)) {
            return töötajateGraafik.get(töötaja).containsKey(kuupäev);
        } return false;
    }

    private Boolean kasTöötajaVaba(int kuupäev, Töötaja töötaja) {
        if (töötaja.getHaiguslehePäevad().contains(kuupäev)) return false;
        return true;
    }

    private Boolean kasPiirangudKehtivad() {
        return true;
    }

    public static void rekursioon(
            List<KirjaPandudVahetus> kirjaPandudVahetused,
            TöötajaVahetus[][] tühiGraafik,
            TöötajaVahetus[][] parimGraafik,
            TöötajateGraafik töötajateGraafik,
            List<Töötaja> töötajateNimekiri,
            HashMap<Integer, List<Vahetus>> vahetusteList,
            List<TöötajaVahetus[][]> parimadGraafikud,
            int praeguneHinne,
            int parimHinne,
            int kuupäev,
            Boolean alustatud
    ) {

        if (kuupäev == ) {
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
        Vahetus vahetus = vahetusteList.get(kuupäev).get(0);

        // suur loop kõige ümber
        for (Töötaja töötaja : töötajateNimekiri) {

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
