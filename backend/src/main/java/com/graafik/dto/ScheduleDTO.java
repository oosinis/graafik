package com.graafik.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.graafik.model.DaySchedule;

public class ScheduleDTO {
    private UUID id;
    private int month;
    private int year;
    private int score;
    private List<DaySchedule> daySchedules;
    private Map<UUID, Integer> workerHours;

    public ScheduleDTO() {}

    public ScheduleDTO(UUID id, int month, int year, int score, List<DaySchedule> daySchedules, Map<UUID, Integer> workerHours) {
        this.id = id;
        this.month = month;
        this.year = year;
        this.score = score;
        this.daySchedules = daySchedules;
        this.workerHours = workerHours;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public List<DaySchedule> getDaySchedules() { return daySchedules; }
    public void setDaySchedules(List<DaySchedule> dayScheduleIds) { this.daySchedules = dayScheduleIds; }

    public Map<UUID,Integer> getWorkerHours() { return workerHours; }
    public void setWorkerHours(Map<UUID,Integer> workerHours) { this.workerHours = workerHours; }
    
}
