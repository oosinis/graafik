package data;

import objects.Vahetus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TööpäevaVahetus {

    List<Vahetus> tööpäevaVahetus = new ArrayList<>(Arrays.asList(
            new Vahetus(24, "intensiiv"),
            new Vahetus(24, "osakond"),
            new Vahetus(8, "lühike päev")
    ));


    public List<Vahetus> getTööpäevaVahetus() {
        return tööpäevaVahetus;
    }

}
