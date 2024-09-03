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

    public int getWorkLoadHours() {
        return workLoadHours;
    }

    public void setWorkLoadHours(int workLoadHours) {
        this.workLoadHours = workLoadHours;
    }

    public double getWorkLoad() {
        return workLoad;
    }

    public void setWorkLoad(double workLoad) {
        this.workLoad = workLoad;
    }

    public Integer getHoursBalance() {
        return hoursBalance;
    }

    public void setHoursBalance(Integer hoursBalance) {
        this.hoursBalance = hoursBalance;
    }

    public int getLastMonthLastDayHours() {
        return lastMonthLastDayHours;
    }

    public void setLastMonthLastDayHours(int lastMonthLastDayHours) {
        this.lastMonthLastDayHours = lastMonthLastDayHours;
    }

    public List<Integer> getVacationDays() {
        return vacationDays;
    }

    public void setVacationDays(List<Integer> vacationDays) {
        this.vacationDays = vacationDays;
    }

    public List<Integer> getDesiredVacationDays() {
        return desiredVacationDays;
    }

    public void setDesiredVacationDays(List<Integer> desiredVacationDays) {
        this.desiredVacationDays = desiredVacationDays;
    }

    public HashMap<Integer, Shift> getDesiredWorkDays() {
        return desiredWorkDays;
    }

    public void setDesiredWorkDays(HashMap<Integer, Shift> desiredWorkDays) {
        this.desiredWorkDays = desiredWorkDays;
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
