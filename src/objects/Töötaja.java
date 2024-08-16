package objects;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Töötaja {

    int employeeId;
    String nimi;
    double töökoormus;
    Integer eelmiseKuuÜlejääk;
    int eelmiseKuuVahetuseTunnid;
    List<Integer> puhkusePäevad = new ArrayList<>();
    List<Integer> sooviPuhkePäevad = new ArrayList<>();
    HashMap<Integer, Vahetus> sooviTööPäevad = new HashMap<>();

    List<Integer> haiguslehePäevad = new ArrayList<>();

    public Töötaja(int employeeId, String nimi, double töökoormus, Integer eelmiseKuuÜlejääk, int eelmiseKuuVahetuseTunnid, List<Integer> puhkusePäevad, List<Integer> sooviPuhkePäevad, HashMap<Integer, Vahetus> sooviTööPäevad, List<Integer> haiguslehePäevad) {
        this.employeeId = employeeId;
        this.nimi = nimi;
        this.töökoormus = töökoormus;
        this.eelmiseKuuÜlejääk = eelmiseKuuÜlejääk;
        this.eelmiseKuuVahetuseTunnid = eelmiseKuuVahetuseTunnid;
        this.puhkusePäevad = puhkusePäevad;
        this.sooviPuhkePäevad = sooviPuhkePäevad;
        this.sooviTööPäevad = sooviTööPäevad;
        this.haiguslehePäevad = haiguslehePäevad;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getNimi() {
        return nimi;
    }

    public void setNimi(String nimi) {
        this.nimi = nimi;
    }

    public double getTöökoormus() {
        return töökoormus;
    }

    public void setTöökoormus(double töökoormus) {
        this.töökoormus = töökoormus;
    }

    public Integer getEelmiseKuuÜlejääk() {
        return eelmiseKuuÜlejääk;
    }

    public void setEelmiseKuuÜlejääk(Integer eelmiseKuuÜlejääk) {
        this.eelmiseKuuÜlejääk = eelmiseKuuÜlejääk;
    }

    public int getEelmiseKuuVahetuseTunnid() {
        return eelmiseKuuVahetuseTunnid;
    }

    public void setEelmiseKuuVahetuseTunnid(int eelmiseKuuVahetuseTunnid) {
        this.eelmiseKuuVahetuseTunnid = eelmiseKuuVahetuseTunnid;
    }

    public List<Integer> getPuhkusePäevad() {
        return puhkusePäevad;
    }

    public void setPuhkusePäevad(List<Integer> puhkusePäevad) {
        this.puhkusePäevad = puhkusePäevad;
    }

    public List<Integer> getSooviPuhkePäevad() {
        return sooviPuhkePäevad;
    }

    public void setSooviPuhkePäevad(List<Integer> sooviPuhkePäevad) {
        this.sooviPuhkePäevad = sooviPuhkePäevad;
    }

    public HashMap<Integer, Vahetus> getSooviTööPäevad() {
        return sooviTööPäevad;
    }

    public void setSooviTööPäevad(HashMap<Integer, Vahetus> sooviTööPäevad) {
        this.sooviTööPäevad = sooviTööPäevad;
    }

    public List<Integer> getHaiguslehePäevad() {
        return haiguslehePäevad;
    }

    public void setHaiguslehePäevad(List<Integer> haiguslehePäevad) {
        this.haiguslehePäevad = haiguslehePäevad;
    }

    @Override
    public String toString() {
        return "Töötaja{" +
                "nimi='" + nimi + '\'' +
                '}';
    }
}
