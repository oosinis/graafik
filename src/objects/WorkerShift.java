package objects;

public class WorkerShift {
    private Shift vahetus;
    private Worker töötaja;

    public WorkerShift(Shift vahetus, Worker töötaja) {
        this.vahetus = vahetus;
        this.töötaja = töötaja;
    }

    public Shift getVahetus() {
        return vahetus;
    }

    public void setVahetus(Shift vahetus) {
        this.vahetus = vahetus;
    }

    public Worker getTöötaja() {
        return töötaja;
    }

    public void setTöötaja(Worker töötaja) {
        this.töötaja = töötaja;
    }

    @Override
    public String toString() {
        return "TöötajaVahetus{" +
                "vahetus=" + vahetus.toString() +
                ", töötaja=" + töötaja.toString() +
                '}';
    }
}
