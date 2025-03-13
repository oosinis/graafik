package com.graafik.model;

public class RecordedShift {

    private int shiftDate;
    private Worker worker;
    private int scheduleScore;

    public RecordedShift(int shiftDate, Worker worker, int scheduleScore) {
        this.shiftDate = shiftDate;
        this.worker = worker;
        this.scheduleScore = scheduleScore;
    }

    public int getShiftDate() {
        return shiftDate;
    }

    public void setShiftDate(int shiftDate) {
        this.shiftDate = shiftDate;
    }

    public Worker getWorker() {
        return worker;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    public int getScheduleScore() {
        return scheduleScore;
    }

    public void setScheduleScore(int scheduleScore) {
        this.scheduleScore = scheduleScore;
    }

}
