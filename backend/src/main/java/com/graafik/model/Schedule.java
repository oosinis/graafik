package com.graafik.model;

import java.util.List;

public class Schedule {
    private int month;
    private int year;
    private List<DaySchedule> daySchedules;

    // No-args constructor
    public Schedule() {}

    // Getters
    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public List<DaySchedule> getDaySchedules() {
        return daySchedules;
    }

    // Setters
    public void setMonth(int month) {
        this.month = month;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setDaySchedules(List<DaySchedule> daySchedules) {
        this.daySchedules = daySchedules;
    }
}
