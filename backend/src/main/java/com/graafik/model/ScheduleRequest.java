package com.graafik.model;

import java.util.List;

public class ScheduleRequest {
    private List<Worker> workers;
    private List<Shift> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequest() {}

    public List<Shift> getShifts() {return shifts;}
    public void setShifts(List<Shift> shifts) { this.shifts = shifts; }

    public List<Worker> getWorkers() { return workers; }
    public void setWorkers(List<Worker> workers) { this.workers = workers; }

    public int getMonth() { return month; }

    public long getFullTimeMinutes() { return fullTimeMinutes; }

}