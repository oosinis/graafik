package com.graafik.model.Dtos;

import java.util.List;

import com.graafik.model.Entities.*;

public class ScheduleRequest {
    private List<Employee> employees;
    private List<Shift> shifts;
    private int month;
    private int year;
    private long fullTimeMinutes;

    public ScheduleRequest() {}
    public ScheduleRequest(List<Employee> employees, List<Shift> shifts, int month, int year, long fullTimeMinutes) {
        this.employees = employees;
        this.shifts = shifts;
        this.month = month;
        this.year = year;
        this.fullTimeMinutes = fullTimeMinutes;
    };

    public List<Shift> getShifts() { return shifts; }
    public void setShifts(List<Shift> shifts) { this.shifts = shifts; }

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public long getFullTimeMinutes() { return fullTimeMinutes; }
    public void setFullTimeMinutes(long fullTimeMinutes) { this.fullTimeMinutes = fullTimeMinutes; }

}