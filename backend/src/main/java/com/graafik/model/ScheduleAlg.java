package com.graafik.model;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ScheduleAlg {
    private UUID id;
    private int month;
    private int year;
    private int score;
    private long fullTimeMinutes;
    private Map<UUID, Long> workerHoursInMinutes;

    private List<DaySchedule> daySchedules;

    public ScheduleAlg() {}

    public ScheduleAlg(UUID id, int month, int year, int score, long fullTimeMinutes, List<DaySchedule> daySchedules, Map<UUID, Long> workerHoursInMinCountingDown, List<Worker> workers) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.score = score;
        this.fullTimeMinutes = fullTimeMinutes;
        this.daySchedules = daySchedules;
        this.workerHoursInMinutes = workerHoursInMinCountingDown;
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public int getScore() {
        return score;
    }

    public long getFullTimeMinutes() {
        return fullTimeMinutes;
    }

    public List<DaySchedule> getDaySchedules() { 
        return daySchedules;
    }

    public void setDaySchedules(List<DaySchedule> daySchedules) {
        this.daySchedules = daySchedules; 
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

    public void setFullTimeMinutes(long minutes) {
        this.fullTimeMinutes = minutes;
    }
    
    public Map<UUID, Long> getWorkerHoursInMinutes() {
        return workerHoursInMinutes;
    }

    public void setWorkerHoursInMinutes(Map<UUID, Long> workerHours) {
        this.workerHoursInMinutes = workerHours;
    }

    public void changeWorkerHours(long x, UUID workerId) {
        this.workerHoursInMinutes.put(workerId, this.workerHoursInMinutes.get(workerId) + x);
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
            sb.setLength(sb.length() - 2);
            sb.append("\n]\n");
        }

        sb.append("}");
        return sb.toString();
}

}
