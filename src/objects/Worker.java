package objects;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Worker {

    int employeeId;
    String name;
    int workLoadHours;
    double workLoad;
    Integer hoursBalance;
    int lastMonthLastDayHours;
    List<Integer> vacationDays = new ArrayList<>();
    List<Integer> desiredVacationDays = new ArrayList<>();
    HashMap<Integer, Shift> desiredWorkDays = new HashMap<>();
    int hoursWorked;
    double percentageWorked;

    List<Integer> sickLeaveDays = new ArrayList<>();

    public Worker(int employeeId, String name, int workLoadHours, double workLoad, Integer hoursBalance, int lastMonthLastDayHours,
            List<Integer> vacationDays, List<Integer> desiredVacationDays, HashMap<Integer, Shift> desiredWorkDays,
            List<Integer> sickLeaveDays) {
        this.employeeId = employeeId;
        this.name = name;
        this.workLoadHours = workLoadHours;
        this.workLoad = workLoad;
        this.hoursBalance = hoursBalance;
        this.lastMonthLastDayHours = lastMonthLastDayHours;
        this.vacationDays = vacationDays;
        this.desiredVacationDays = desiredVacationDays;
        this.desiredWorkDays = desiredWorkDays;
        this.sickLeaveDays = sickLeaveDays;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String nimi) {
        this.name = nimi;
    }

    public int getTöökoormuseTunnid() {
        return workLoadHours;
    }

    public void setTöökoormuseTunnid(int töökoormuseTunnid) {
        this.workLoadHours = töökoormuseTunnid;
    }

    public double getTööKoormus() {
        return workLoad;
    }

    public void setTööKoormus(int tööKoormus) {
        this.workLoad = tööKoormus;
    }


    public Integer getEelmiseKuuÜlejääk() {
        return hoursBalance;
    }

    public void setEelmiseKuuÜlejääk(Integer eelmiseKuuÜlejääk) {
        this.hoursBalance = eelmiseKuuÜlejääk;
    }

    public int getEelmiseKuuVahetuseTunnid() {
        return lastMonthLastDayHours;
    }

    public void setEelmiseKuuVahetuseTunnid(int eelmiseKuuVahetuseTunnid) {
        this.lastMonthLastDayHours = eelmiseKuuVahetuseTunnid;
    }

    public List<Integer> getPuhkusePäevad() {
        return vacationDays;
    }

    public void setPuhkusePäevad(List<Integer> puhkusePäevad) {
        this.vacationDays = puhkusePäevad;
    }

    public List<Integer> getSooviPuhkePäevad() {
        return desiredVacationDays;
    }

    public void setSooviPuhkePäevad(List<Integer> sooviPuhkePäevad) {
        this.desiredVacationDays = sooviPuhkePäevad;
    }

    public HashMap<Integer, Shift> getSooviTööPäevad() {
        return desiredWorkDays;
    }

    public void setSooviTööPäevad(HashMap<Integer, Shift> sooviTööPäevad) {
        this.desiredWorkDays = sooviTööPäevad;
    }

    public List<Integer> getSickLeaveDays() {
        return sickLeaveDays;
    }

    public void setSickLeaveDays(List<Integer> haiguslehePäevad) {
        this.sickLeaveDays = haiguslehePäevad;
    }

    public int getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(int hoursWorked) {
        this.hoursWorked += hoursWorked;
    }

    public double getPercentageWorked() {
        return percentageWorked;
    }

    public void setPercentageWorked(double percentageWorked) {
        this.percentageWorked += percentageWorked;
    }

    @Override
    public String toString() {
        return "Töötaja{" +
                "nimi='" + name + '\'' +
                '}';
    }
}
