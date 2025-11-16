package com.graafik.model.Entities;

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

    public DaySchedule getDaySchedule() {
        return daySchedule;
    }

    public void setDaySchedule(DaySchedule daySchedule) {
        this.daySchedule = daySchedule;
    }

    public Shift getShift() {
        return shift;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
