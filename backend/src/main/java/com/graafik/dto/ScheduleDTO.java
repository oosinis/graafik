package com.graafik.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.graafik.model.DaySchedule;
import com.graafik.model.Worker;

public class ScheduleDTO {
    private UUID id;
    private int month;
    private int year;
    private int score;
    private long fullTimeHours;
    private List<DaySchedule> daySchedules;
    private Map<UUID, Long> workerHoursInMinutes;
    private List<Worker> workers;

    public ScheduleDTO() {}

    public ScheduleDTO(UUID id, int month, int year, int score, long fullTimeHours, List<DaySchedule> daySchedules, Map<UUID, Long> workerHours, List<Worker> workers) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.score = score;
        this.fullTimeHours = fullTimeHours;
        this.daySchedules = daySchedules;
        this.workerHoursInMinutes = workerHours;
        this.workers = workers;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public Map<UUID, Long> getWorkerHoursInMinutes() { return workerHoursInMinutes; }
    public void setWorkerHoursInMinutes(Map<UUID,Long> workerHours) { this.workerHoursInMinutes = workerHours; }

    public List<Worker> getWorkers() { return workers; }
    public void setWorkers(List<Worker> workers) { this.workers = workers; }

}
