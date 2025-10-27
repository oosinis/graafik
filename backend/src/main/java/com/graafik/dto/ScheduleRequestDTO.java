package com.graafik.dto;

import java.util.List;

import com.graafik.model.Worker;

public class ScheduleRequestDTO {
    private List<Worker> workers;
    private List<ShiftDTO> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequestDTO() {}

    public List<ShiftDTO> getShifts() {return shifts;}
    public void setShifts(List<ShiftDTO> shifts) { this.shifts = shifts; }

    public List<Worker> getWorkers() { return workers; }
    public void setWorkers(List<Worker> workers) { this.workers = workers; }

    public int getMonth() { return month; }

    public long getFullTimeMinutes() { return fullTimeMinutes; }

}