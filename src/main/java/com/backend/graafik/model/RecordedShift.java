package com.backend.graafik.model;

public class RecordedShift {

    private int shiftDate;
    private int workerId;
    private int scheduleScore;

    public RecordedShift(int shiftDate, int workerId, int scheduleScore) {
        this.shiftDate = shiftDate;
        this.workerId = workerId;
        this.scheduleScore = scheduleScore;
    }

    public int getShiftDate() {
        return shiftDate;
    }

    public void setShiftDate(int shiftDate) {
        this.shiftDate = shiftDate;
    }

    public int getWorkerId() {
        return workerId;
    }

    public void setWorkerId(int workerId) {
        this.workerId = workerId;
    }

    public int getScheduleScore() {
        return scheduleScore;
    }

    public void setScheduleScore(int scheduleScore) {
        this.scheduleScore = scheduleScore;
    }

}
