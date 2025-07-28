package com.graafik.model;

import java.util.List;
import java.util.Map;

public class Schedule {
    private int id;
    private int month;
    private int year;
    private List<DaySchedule> daySchedules;
    private int score;
    private Map<WorkerDto, Integer> workerHours;

    public Schedule() {}

    public int getId() {
        return id;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public int getScore() {
        return score;
    }

    public List<DaySchedule> getDaySchedules() {
        return daySchedules;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void addToScore(int addition) {
        this.score = this.score + addition;
    }

    public void setDaySchedules(List<DaySchedule> daySchedules) {
        this.daySchedules = daySchedules;
    }

    public Map<WorkerDto, Integer> getWorkerHours() {
        return workerHours;
    }

    public void setWorkerHours(Map<WorkerDto, Integer> workerHours) {
        this.workerHours = workerHours;
    }

    public void changeWorkerHours(int x, WorkerDto worker) {
        this.workerHours.put(worker, this.workerHours.get(worker) + x);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Schedule{");
        sb.append("month=").append(month);
        sb.append(", year=").append(year);
        sb.append(", daySchedules=");

        if (daySchedules == null || daySchedules.isEmpty()) {
            sb.append("[]");
        } else {
            sb.append("\n[\n");
            for (DaySchedule daySchedule : daySchedules) {
                sb.append(daySchedule.toString()).append(", \n");
            }
            sb.setLength(sb.length() - 2); // Remove the last comma and space
            sb.append("\n]\n");
        }

        sb.append("}");
        return sb.toString();
}

}
