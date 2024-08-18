package data;

import objects.Worker;
import objects.Shift;

public class KirjaPandudVahetus {
    int kuupäev;
    Worker töötaja;
    Shift vahetus;
    int hindeMuutus;

    public KirjaPandudVahetus(int kuupäev, Worker töötaja, Shift vahetus, int hindeMuutus) {
        this.kuupäev = kuupäev;
        this.töötaja = töötaja;
        this.vahetus = vahetus;
        this.hindeMuutus = hindeMuutus;
    }

    public int getKuupäev() {
        return kuupäev;
    }

    public void setKuupäev(int kuupäev) {
        this.kuupäev = kuupäev;
    }

    public Worker getTöötaja() {
        return töötaja;
    }

    public void setTöötaja(Worker töötaja) {
        this.töötaja = töötaja;
    }

    public Shift getVahetus() {
        return vahetus;
    }

    public void setVahetus(Shift vahetus) {
        this.vahetus = vahetus;
    }

    public int getHindeMuutus() {
        return hindeMuutus;
    }

    public void setHindeMuutus(int hindeMuutus) {
        this.hindeMuutus = hindeMuutus;
    }
}
