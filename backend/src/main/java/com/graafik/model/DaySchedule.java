package com.graafik.model;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "day_schedules")
public class DaySchedule extends BaseEntity {
    
    @Column(name = "schedule_id")
    private UUID scheduleId;

    @Column(nullable = false)
    private int dayOfMonth;

    private int score;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "day_schedule_id")
    @JsonManagedReference
    private List<ShiftAssignment> assignments;

    public DaySchedule() {}

    public DaySchedule(int dayOfMonth, List<ShiftAssignment> assignments) {
        this.dayOfMonth = dayOfMonth;
        this.assignments = assignments;
    }


    public UUID getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId (UUID scheduleId) {
        this.scheduleId = scheduleId;
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

    public static ShiftAssignment containsWorker(DaySchedule ShiftAssignments, Worker worker) {
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
            sb.setLength(sb.length() - 2);
            sb.append("\n]\n");
        }
    
        sb.append("}");
        return sb.toString();
    }
    
}
