package com.graafik.model.Dtos;

import java.util.List;

import com.graafik.model.Entities.*;

public class ScheduleRequest {
    private List<Employee> employees;
    private List<Shift> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequest() {}
    public ScheduleRequest(List<Employee> employees, List<Shift> shifts, int month, long fullTimeMinutes) {
        this.employees = employees;
        this.shifts = shifts;
        this.month = month;
        this.fullTimeMinutes = fullTimeMinutes;
    };

    public List<Shift> getShifts() { return shifts; }
    public void setShifts(List<Shift> shifts) { this.shifts = shifts; }

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }

    public int getMonth() { return month; }

    public long getFullTimeMinutes() { return fullTimeMinutes; }

}