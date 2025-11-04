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
    private long fullTimeHours;


    @ElementCollection
    @CollectionTable(name = "schedule_worker_hours", joinColumns = @JoinColumn(name = "schedule_id"))
    @MapKeyColumn(name = "worker_id")
    @Column(name = "hours")
    private Map<UUID, Long> workerHoursInMinCountingUp;

    private List<Worker> workers;

    @Transient
    private List<DaySchedule> daySchedules;

    public Schedule() {}

    public Schedule(int month, int year, int score, long fullTimeHours, List<DaySchedule> daySchedules, Map<UUID, Long> workerHours, List<Worker> workers) {
        this.month = month;
        this.year = year;
        this.score = score;
        this.fullTimeHours = fullTimeHours;
        this.daySchedules = daySchedules;
        this.workerHoursInMinCountingUp = workerHours;
        this.workers = workers;
    }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public long getFullTimeHours() { return fullTimeHours; }
    public void setFullTimeHours(long hours) { this.fullTimeHours = hours; }

    public List<DaySchedule> getDaySchedules() { return daySchedules; }
    public void setDaySchedules(List<DaySchedule> dayScheduleIds) { this.daySchedules = dayScheduleIds; }

    public Map<UUID, Long> getWorkerHoursInMinCountingUp() { return workerHoursInMinCountingUp; }
    public void setWorkerHoursInMinCountingUp(Map<UUID,Long> workerHours) { this.workerHoursInMinCountingUp = workerHours; }

    public List<Worker> getWorkers() { return workers; }
    public void setWorkers(List<Worker> workers) { this.workers = workers; }

}
