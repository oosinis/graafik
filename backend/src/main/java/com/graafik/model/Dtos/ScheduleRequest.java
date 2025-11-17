package com.graafik.model.Dtos;

import java.util.List;

import com.graafik.model.Entities.*;

public class ScheduleRequest {
    private List<Employee> employees;
    private List<Shift> shifts;
    private int month;
    private long fullTimeMinutes;

    public ScheduleRequest() {}

    public List<Shift> getShifts() {return shifts;}
    public void setShifts(List<Shift> shifts) { this.shifts = shifts; }

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }

    public int getMonth() { return month; }

    public long getFullTimeMinutes() { return fullTimeMinutes; }

}