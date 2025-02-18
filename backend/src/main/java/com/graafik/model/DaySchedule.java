package com.graafik.model;

import java.util.List;

public class DaySchedule {
    private int dayOfMonth;
    private List<ShiftAssignment> assignments;
    private int score;

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

    public int getScore() {
        return score;
    }

    // Setters
    public void setDayOfMonth(int dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }

    public void setAssignments(List<ShiftAssignment> assignments) {
        this.assignments = assignments;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void addToScore(int addition) {
        this.score = this.score + addition;
    }

    public static ShiftAssignment containsWorker(DaySchedule ShiftAssignments, WorkerDto worker) {
        for (ShiftAssignment shiftAssignment : ShiftAssignments.getAssignments()) {
            if (shiftAssignment.getWorker().equals(worker)) {
                return shiftAssignment;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("DaySchedule{");
        sb.append("dayOfMonth=").append(dayOfMonth);
        sb.append(", assignments=");
    
        if (assignments == null || assignments.isEmpty()) {
            sb.append("[]");
        } else {
            sb.append("[\n");
            for (ShiftAssignment assignment : assignments) {
                sb.append(assignment.toString()).append(",\n ");
            }
            sb.setLength(sb.length() - 2); // Remove the last comma and space
            sb.append("\n]\n");
        }
    
        sb.append("}");
        return sb.toString();
    }
    
}
