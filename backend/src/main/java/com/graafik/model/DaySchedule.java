package com.graafik.model;

import java.util.List;

public class DaySchedule {
    private int dayOfMonth;
    private List<ShiftAssignment> assignments;

    // No-args constructor
    public DaySchedule() {}

    // Parameterized constructor
    public DaySchedule(int dayOfMonth, List<ShiftAssignment> assignments) {
        this.dayOfMonth = dayOfMonth;
        this.assignments = assignments;
    }

    // Getters
    public int getDayOfMonth() {
        return dayOfMonth;
    }

    public List<ShiftAssignment> getAssignments() {
        return assignments;
    }

    // Setters
    public void setDayOfMonth(int dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }

    public void setAssignments(List<ShiftAssignment> assignments) {
        this.assignments = assignments;
    }
}
