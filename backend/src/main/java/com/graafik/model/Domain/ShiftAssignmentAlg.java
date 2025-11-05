package com.graafik.model;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ShiftAssignmentAlg {
    private UUID id;

    private UUID dayScheduleId;

    private ShiftAlg shift;

    private Employee employee;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ShiftAssignment() {}

    public ShiftAssignment(ShiftAlg shift, Employee employee) {
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
}
