package com.graafik.model;
import java.util.List;

public class ScheduleRequest {

    private List<Worker> workers;
    private List<Shift> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequest() {}

    public ScheduleRequest(List<Worker> workers, List<Shift> shifts, int month, long fullTimeMinutes) {
        this.workers = workers;
        this.shifts = shifts;
        this.month = month;
        this.fullTimeMinutes = fullTimeMinutes;
    
    }

    public List<Worker> getWorkers() {
        return workers;
    }

    public List<Shift> getShifts() {
        return shifts;
    }

    public int getMonth() {
        return month;
    }

    public long getFullTimeMinutes() {
        return fullTimeMinutes;
    }

    public void setWorkers(List<Worker> workers) {
        this.workers = workers;
    }

    public void setShifts(List<Shift> shifts) {
        this.shifts = shifts;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setFullTimeMinutes(long fullTimeMinutes) {
        this.fullTimeMinutes = fullTimeMinutes;
    }
}
