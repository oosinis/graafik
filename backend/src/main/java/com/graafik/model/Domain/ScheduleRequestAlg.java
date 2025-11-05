package com.graafik.model;
import java.util.List;

public class ScheduleRequestAlg {

    private List<Employee> employees;
    private List<ShiftAlg> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequestAlg() {}

    public ScheduleRequestAlg(List<Employee> employees, List<ShiftAlg> shifts, int month, long fullTimeMinutes) {
        this.employees = employees;
        this.shifts = shifts;
        this.month = month;
        this.fullTimeMinutes = fullTimeMinutes;
    
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public List<ShiftAlg> getShifts() {
        return shifts;
    }

    public int getMonth() {
        return month;
    }

    public long getFullTimeMinutes() {
        return fullTimeMinutes;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public void setShifts(List<ShiftAlg> shifts) {
        this.shifts = shifts;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setFullTimeMinutes(long fullTimeMinutes) {
        this.fullTimeMinutes = fullTimeMinutes;
    }
}
