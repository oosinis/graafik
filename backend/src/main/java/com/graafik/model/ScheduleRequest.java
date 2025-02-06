package com.graafik.model;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ScheduleRequest {

    @JsonProperty("workers")
    private List<Worker> workers;

    @JsonProperty("shifts")
    private List<Shift> shifts;

    @JsonProperty("month")
    private int month;

    @JsonProperty("year")
    private int year;

    @JsonProperty("fullTimeHours")
    private int fullTimeHours;

    // Constructor with all fields
    public ScheduleRequest(List<Worker> workers, List<Shift> shifts, int month, int year, int fullTimeHours) {
        this.workers = workers;
        this.shifts = shifts;
        this.month = month;
        this.year = year;
        this.fullTimeHours = fullTimeHours;
    }

    // Getters
    public List<Worker> getWorkers() {
        return workers;
    }

    public List<Shift> getShifts() {
        return shifts;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public int getFullTimeHours() {
        return fullTimeHours;
    }

    // Setters
    public void setWorkers(List<Worker> workers) {
        this.workers = workers;
    }

    public void setShifts(List<Shift> shifts) {
        this.shifts = shifts;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setFullTimeHours(int fullTimeHours) {
        this.fullTimeHours = fullTimeHours;
    }
}
