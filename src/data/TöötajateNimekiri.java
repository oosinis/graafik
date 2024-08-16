package data;

import objects.Töötaja;
import objects.Vahetus;

import java.util.*;

public class TöötajateNimekiri {
    private List<Töötaja> töötajateNimekiri = new ArrayList<>();

    public TöötajateNimekiri() {
        // HELVE
        List<Integer> helvePuhkusePäevad = new ArrayList<>();
        ArrayList<Integer> helveSooviPuhkepäevad = new ArrayList<>(Arrays.asList(1, 26, 27, 28, 29));
        HashMap<Integer, Vahetus> helveSooviTööpäevad = new HashMap<>();
        Töötaja helve = new Töötaja(0, "Helve", 1.0, -6,  0, helvePuhkusePäevad, helveSooviPuhkepäevad, helveSooviTööpäevad);
        töötajateNimekiri.add(helve);

        // KAI
        List<Integer> kaiPuhkusePäevad = new ArrayList<>();
        List<Integer> kaiSooviPuhkepäevad = new ArrayList<>(Arrays.asList(27, 28, 29 , 30));
        HashMap<Integer, Vahetus> kaiSooviTööpäevad = new HashMap<>();
        Töötaja kai = new Töötaja(1, "Kai", 1.0, -8, 8, kaiPuhkusePäevad, kaiSooviPuhkepäevad, kaiSooviTööpäevad);
        töötajateNimekiri.add(kai);

        // KAJA
        List<Integer> kajaPuhkusePäevad = new ArrayList<>();
        List<Integer> kajaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Vahetus> kajaSooviTööpäevad = new HashMap<>();
        Töötaja kaja = new Töötaja(2, "Kaja", 1.0, -8, 0, kajaPuhkusePäevad, kajaSooviPuhkePäevad, kajaSooviTööpäevad);
        //töötajateNimekiri.add(kaja);

        // PÄRJA
        List<Integer> pärjaPuhkusePäevad = new ArrayList<>();
        List<Integer> pärjaSooviPuhkePäevad = new ArrayList<>();
        HashMap<Integer, Vahetus> pärjaSooviTööpäevad = new HashMap<>(Map.of(
                4, new Vahetus(24, "osakond"),
                7, new Vahetus(24, "osakond"),
                10, new Vahetus(24, "osakond"),
                13, new Vahetus(24, "osakond"),
                21, new Vahetus(24, "osakond"),
                28, new Vahetus(24, "osakond"),
                30, new Vahetus(24, "osakond")
            ));
        Töötaja pärja = new Töötaja(3, "Pärja", 1.0, -12, 8, pärjaPuhkusePäevad, pärjaSooviPuhkePäevad, pärjaSooviTööpäevad);
        töötajateNimekiri.add(pärja);
    }

    // Getter method for the list
    public List<Töötaja> getTöötajateNimekiri() {
        return töötajateNimekiri;
    }

    // Setter method for the list
    public void setTöötajateNimekiri(List<Töötaja> töötajateNimekiri) {
        this.töötajateNimekiri = töötajateNimekiri;
    }
}
