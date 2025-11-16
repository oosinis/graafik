package com.graafik.model.Domain;

import java.util.List;

import com.graafik.model.Entities.Employee;

public class DayScheduleAlg {
    
    private int dayOfMonth;

    private int score;

    private List<ShiftAssignmentAlg> assignments;

    public DayScheduleAlg(int dayOfMonth, List<ShiftAssignmentAlg> assignments) {
        this.dayOfMonth = dayOfMonth;
        this.assignments = assignments;
    }

    public int getDayOfMonth() {
        return dayOfMonth;
    }

    public List<ShiftAssignmentAlg> getAlgAssignments() {
        return assignments;
    }

    public int getScore() {
        return score;
    }

    public void setDayOfMonth(int dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }

    public void setAssignments(List<ShiftAssignmentAlg> assignments) {
        this.assignments = assignments;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void addToScore(int addition) {
        this.score = this.score + addition;
    }

    public static ShiftAssignmentAlg containsEmployee(DayScheduleAlg ShiftAssignments, Employee employee) {
        for (ShiftAssignmentAlg shiftAssignment : ShiftAssignments.getAlgAssignments()) {
            if (shiftAssignment.getEmployee().equals(employee)) {
                return shiftAssignment;
            }
        }
        return null;
    }
}