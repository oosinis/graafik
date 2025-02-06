package com.graafik.model;

public class ShiftAssignment {
    private Shift shift;
    private WorkerDto worker;


    // Parameterized constructor
    public ShiftAssignment(Shift shift, WorkerDto worker) {
        this.shift = shift;
        this.worker = worker;
    }

    // Getters
    public Shift getShift() {
        return shift;
    }

    public WorkerDto getWorker() {
        return worker;
    }

    // Setters
    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public void setWorker(WorkerDto worker) {
        this.worker = worker;
    }
}
