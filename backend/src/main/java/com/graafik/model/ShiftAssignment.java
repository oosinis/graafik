package com.graafik.model;

public class ShiftAssignment {
    private Shift shift;
    private Worker worker;


    // Parameterized constructor
    public ShiftAssignment(Shift shift, Worker worker) {
        this.shift = shift;
        this.worker = worker;
    }

    // Getters
    public Shift getShift() {
        return shift;
    }

    public Worker getWorker() {
        return worker;
    }

    // Setters
    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }
}
