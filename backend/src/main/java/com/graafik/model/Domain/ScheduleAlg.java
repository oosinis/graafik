package com.graafik.model.Domain;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.graafik.model.Entities.*;
import com.graafik.model.Domain.*;

public class ScheduleAlg {
    private int month;
    private int year;
    private int score;
    private long fullTimeMinutes;
    private Map<UUID, Long> employeeHoursInMinutesRemaining;

    private List<DayScheduleAlg> daySchedules;

    public ScheduleAlg() {}

    public ScheduleAlg(int month, int year, int score, long fullTimeMinutes, List<DayScheduleAlg> daySchedules, Map<UUID, Long> employeeHoursInMinutesRemaining) {
        this.month = month;
        this.year = year;
        this.score = score;
        this.fullTimeMinutes = fullTimeMinutes;
        this.daySchedules = daySchedules;
        this.employeeHoursInMinutesRemaining = employeeHoursInMinutesRemaining;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public int getScore() {
        return score;
    }

    public long getFullTimeMinutes() {
        return fullTimeMinutes;
    }

    public List<DayScheduleAlg> getAlgDaySchedules() { 
        return daySchedules;
    }

    public void setAlgDaySchedules(List<DayScheduleAlg> daySchedules) {
        this.daySchedules = daySchedules; 
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void addToScore(int addition) {
        this.score = this.score + addition;
    }

    public void setFullTimeMinutes(long minutes) {
        this.fullTimeMinutes = minutes;
    }
    
    public Map<UUID, Long> getEmployeeHoursInMinutes() {
        return employeeHoursInMinutesRemaining;
    }

    public void setEmployeeHoursInMinutes(Map<UUID, Long> employeeHours) {
        this.employeeHoursInMinutesRemaining = employeeHours;
    }

    public void changeEmployeeHours(long x, UUID employeeId) {
        this.employeeHoursInMinutesRemaining.put(employeeId, this.employeeHoursInMinutesRemaining.get(employeeId) + x);
    }
}
