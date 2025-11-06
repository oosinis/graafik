package com.graafik.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "shift_assignments")
public class ShiftAssignment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "day_schedule_id", nullable = false)
    private DaySchedule daySchedule;

    @ManyToOne
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    public ShiftAssignment() {}

    public ShiftAssignment(Shift shift, Employee employee) {
        this.shift = shift;
        this.employee = employee;
    }

    public UUID getDayScheduleId() {
        return dayScheduleId;
    }

    public void setDayScheduleId (UUID dayScheduleId) {
        this.dayScheduleId = dayScheduleId;
    }

    public ShiftAlg getShift() {
        return shift;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setShift(ShiftAlg shift) {
        this.shift = shift;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @Override // see siin ei peaks vist olema pigem ShiftAssignmentAlg.javas ?
    public String toString() {
        return "ShiftAssignment{" +
               "shift=" + (shift != null ? shift.toString() : "null") +
               ", employee=" + (employee != null ? employee.toString() : "null") +
               '}';
    }
    
}
