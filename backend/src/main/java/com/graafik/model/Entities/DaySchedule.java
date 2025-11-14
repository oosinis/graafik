package com.graafik.model.Entities;

import java.util.List;

import jakarta.persistence.*;


@Entity
@Table(name = "day_schedules")
public class DaySchedule extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(nullable = false)
    private int dayOfMonth;

    private int score;

    @OneToMany(mappedBy = "daySchedule")
    private List<ShiftAssignment> assignments;

    public DaySchedule() {}

    public DaySchedule(int dayOfMonth, List<ShiftAssignment> assignments) {
        this.dayOfMonth = dayOfMonth;
        this.assignments = assignments;
    }

    public int getDayOfMonth() {
        return dayOfMonth;
    }

    public List<ShiftAssignment> getAssignments() {
        return assignments;
    }

    public int getScore() {
        return score;
    }

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

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public static ShiftAssignment containsEmployee(DaySchedule ShiftAssignments, Employee employee) {
        for (ShiftAssignment shiftAssignment : ShiftAssignments.getAssignments()) {
            if (shiftAssignment.getEmployee().equals(employee)) {
                return shiftAssignment;
            }
        }
        return null;
    }
}
