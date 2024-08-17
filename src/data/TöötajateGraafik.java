package data;

import objects.Töötaja;
import objects.Vahetus;

import java.util.HashMap;
import java.util.Map;

public class TöötajateGraafik {

    HashMap<Töötaja, HashMap<Integer, Vahetus>> töötajateGraafik;

    public TöötajateGraafik(HashMap<Töötaja, HashMap<Integer, Vahetus>> töötajateGraafik) {
        this.töötajateGraafik = töötajateGraafik;
    }

    public void addToTöötajaGraafik(Töötaja töötaja, Integer kuupäev, Vahetus vahetus) {
        // Check if the employee is already in the schedule
        if (töötajateGraafik.containsKey(töötaja)) {
            // Get the employee's schedule
            HashMap<Integer, Vahetus> töötajaGraafik = töötajateGraafik.get(töötaja);

            // Check if the specific date already has a shift assigned
            if (töötajaGraafik.containsKey(kuupäev)) {
                System.out.println("Vahetus already exists for this date: " + kuupäev);
            } else {
                // Add the shift to the specific date
                töötajaGraafik.put(kuupäev, vahetus);
                System.out.println("Added vahetus for " + töötaja.getNimi() + " on date: " + kuupäev);
            }
        } else {
            // If the employee does not exist, create a new schedule for them
            HashMap<Integer, Vahetus> newGraafik = new HashMap<>();
            newGraafik.put(kuupäev, vahetus);

            // Add the new schedule to the main schedule
            töötajateGraafik.put(töötaja, newGraafik);
            System.out.println("Created new schedule and added vahetus for " + töötaja.getNimi() + " on date: " + kuupäev);
        }
    }

    public void removeFromTöötajateGraafik(Töötaja töötaja, Integer kuupäev) {
        // Check if the employee is in the schedule
        if (töötajateGraafik.containsKey(töötaja)) {
            // Get the employee's schedule
            HashMap<Integer, Vahetus> töötajaGraafik = töötajateGraafik.get(töötaja);

            // Check if the specific date has a shift assigned
            if (töötajaGraafik.containsKey(kuupäev)) {
                // Remove the shift for the specific date
                töötajaGraafik.remove(kuupäev);
                System.out.println("Removed vahetus for " + töötaja.getNimi() + " on date: " + kuupäev);

                // If the employee's schedule is empty, remove the employee from the main schedule
                if (töötajaGraafik.isEmpty()) {
                    töötajateGraafik.remove(töötaja);
                    System.out.println("Removed employee " + töötaja.getNimi() + " from the schedule as they have no shifts left.");
                }
            } else {
                System.out.println("No vahetus found for " + töötaja.getNimi() + " on date: " + kuupäev);
            }
        } else {
            System.out.println("Employee " + töötaja.getNimi() + " is not in the schedule.");
        }
    }



    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        // Loop through the main HashMap
        for (Map.Entry<Töötaja, HashMap<Integer, Vahetus>> employeeEntry : töötajateGraafik.entrySet()) {
            Töötaja töötaja = employeeEntry.getKey();
            HashMap<Integer, Vahetus> schedule = employeeEntry.getValue();

            // Append employee's name
            sb.append("Töötaja: ").append(töötaja.getNimi()).append("\n");

            // Loop through the employee's schedule
            for (Map.Entry<Integer, Vahetus> scheduleEntry : schedule.entrySet()) {
                Integer kuupäev = scheduleEntry.getKey();
                Vahetus vahetus = scheduleEntry.getValue();

                // Append date and shift details
                sb.append("  Kuupäev: ").append(kuupäev)
                        .append(", Vahetus: ").append(vahetus.getCategory())
                        .append(" (Pikkus: ").append(vahetus.getDuration()).append(")\n");
            }

            // Add a separator between employees
            sb.append("\n");
        }

        return sb.toString();
    }
}
