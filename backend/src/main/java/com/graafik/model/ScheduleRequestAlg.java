package com.graafik.model;
import java.util.List;

public class ScheduleRequestAlg {

    private List<Worker> workers;
    private List<ShiftAlg> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequestAlg() {}

    public ScheduleRequestAlg(List<Worker> workers, List<ShiftAlg> shifts, int month, long fullTimeMinutes) {
        this.workers = workers;
        this.shifts = shifts;
        this.month = month;
        this.fullTimeMinutes = fullTimeMinutes;
    
    }

    public List<Worker> getWorkers() {
        return workers;
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

    public void setWorkers(List<Worker> workers) {
        this.workers = workers;
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
