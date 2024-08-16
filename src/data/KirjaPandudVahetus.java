package data;

import objects.Töötaja;
import objects.Vahetus;

public class KirjaPandudVahetus {
    int kuupäev;
    Töötaja töötaja;
    Vahetus vahetus;
    int hindeMuutus;

    public KirjaPandudVahetus(int kuupäev, Töötaja töötaja, Vahetus vahetus, int hindeMuutus) {
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

    public Töötaja getTöötaja() {
        return töötaja;
    }

    public void setTöötaja(Töötaja töötaja) {
        this.töötaja = töötaja;
    }

    public Vahetus getVahetus() {
        return vahetus;
    }

    public void setVahetus(Vahetus vahetus) {
        this.vahetus = vahetus;
    }

    public int getHindeMuutus() {
        return hindeMuutus;
    }

    public void setHindeMuutus(int hindeMuutus) {
        this.hindeMuutus = hindeMuutus;
    }
}
