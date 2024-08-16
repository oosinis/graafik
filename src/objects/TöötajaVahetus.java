package objects;

public class TöötajaVahetus {
    private Vahetus vahetus;
    private Töötaja töötaja;

    public TöötajaVahetus(Vahetus vahetus, Töötaja töötaja) {
        this.vahetus = vahetus;
        this.töötaja = töötaja;
    }

    public Vahetus getVahetus() {
        return vahetus;
    }

    public void setVahetus(Vahetus vahetus) {
        this.vahetus = vahetus;
    }

    public Töötaja getTöötaja() {
        return töötaja;
    }

    public void setTöötaja(Töötaja töötaja) {
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
