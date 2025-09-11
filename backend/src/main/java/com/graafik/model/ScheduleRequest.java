package com.graafik.model;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

public class ScheduleRequest {
    private List<Worker> workers;
    private List<Shift> shifts;
    private int month;
    private int fullTimeHours;

    public ScheduleRequest() {}

    public List<Worker> getWorkers() {
        return workers;
    }

    public List<Shift> getShifts() {
        return shifts;
    }

    public int getMonth() {
        return month;
    }

    public int getFullTimeHours() {
        return fullTimeHours;
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

    public void setFullTimeHours(int fullTimeHours) {
        this.fullTimeHours = fullTimeHours;
    }
}
