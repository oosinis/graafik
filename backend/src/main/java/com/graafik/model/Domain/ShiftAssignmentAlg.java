package com.graafik.model.Domain;

import java.util.UUID;

import com.graafik.model.Entities.Employee;

public class ShiftAssignmentAlg {

    private ShiftAlg shift;

    private Employee employee;

    public ShiftAssignmentAlg(ShiftAlg shift, Employee employee) {
        this.shift = shift;
        this.employee = employee;
    }

    public ShiftAlg getShiftAlg() {
        return shift;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setShiftAlg(ShiftAlg shift) {
        this.shift = shift;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
