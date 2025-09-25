package com.graafik.model;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;


@Entity
@Table(name = "schedules")
public class Schedule extends BaseEntity {
    private int month;
    private int year;
    private int score;

    @ElementCollection
    @CollectionTable(name = "schedule_worker_hours", joinColumns = @JoinColumn(name = "schedule_id"))
    @MapKeyColumn(name = "worker_id")
    @Column(name = "hours")
    private Map<UUID, Integer> workerHours;

    @Transient
    private List<DaySchedule> daySchedules;

    public Schedule() {}

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
    
    public Map<UUID, Integer> getWorkerHours() {
        return workerHours;
    }

    public void setWorkerHours(Map<UUID, Integer> workerHours) {
        this.workerHours = workerHours;
    }

    public void changeWorkerHours(int x, UUID workerId) {
        this.workerHours.put(workerId, this.workerHours.get(workerId) + x);
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
