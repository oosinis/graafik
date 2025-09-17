package com.graafik.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "shift_assignments")
public class ShiftAssignment extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @ManyToOne(optional = false)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    public ShiftAssignment(Shift shift, Worker worker) {
        this.shift = shift;
        this.worker = worker;
    }

    public Shift getShift() {
        return shift;
    }

    public Worker getWorker() {
        return worker;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    @Override
    public String toString() {
        return "ShiftAssignment{" +
               "shift=" + (shift != null ? shift.toString() : "null") +
               ", worker=" + (worker != null ? worker.toString() : "null") +
               '}';
    }
    
}
