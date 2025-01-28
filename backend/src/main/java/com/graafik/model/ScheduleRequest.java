package com.graafik.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ScheduleRequest {

    @JsonProperty("workers")
    private List<WorkerDto> workers;

    @JsonProperty("shifts")
    private List<ShiftDto> shifts;

    @JsonProperty("rules")
    private List<Rule> rules;

    @JsonProperty("month")
    private int month;

    @JsonProperty("fullTimeHours")
    private int fullTimeHours;

    // No-args constructor (required for Jackson deserialization)
    public ScheduleRequest() {}

    // Getters
    public List<WorkerDto> getWorkers() {
        return workers;
    }

    public List<ShiftDto> getShifts() {
        return shifts;
    }

    public List<Rule> getRules() {
        return rules;
    }

    public int getMonth() {
        return month;
    }

    public int getFullTimeHours() {
        return fullTimeHours;
    }

    // Setters
    public void setWorkers(List<WorkerDto> workers) {
        this.workers = workers;
    }

    public void setShifts(List<ShiftDto> shifts) {
        this.shifts = shifts;
    }

    public void setRules(List<Rule> rules) {
        this.rules = rules;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public void setFullTimeHours(int fullTimeHours) {
        this.fullTimeHours = fullTimeHours;
    }
}
