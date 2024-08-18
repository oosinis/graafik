package data;

import objects.Shift;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TööpäevaVahetus {

    List<Shift> tööpäevaVahetus = new ArrayList<>(Arrays.asList(new Shift(24, "intensiiv"),
            new Shift(24, "osakond"),
            new Shift(8, "lühike päev")
    ));


    public List<Shift> getTööpäevaVahetus() {
        return tööpäevaVahetus;
    }

}
