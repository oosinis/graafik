package com.graafik.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WorkerDto {
    @JsonProperty("name")
    private String name;
    @JsonProperty("assignedShifts")
    private List<Shift> assignedShifts;
    @JsonProperty("workLoad")
    private float workLoad;
    @JsonProperty("desiredVacationDays")
    private List<Integer> desiredVacationDays;    
    @JsonProperty("vacationDays")
    private List<Integer> vacationDays;

    public WorkerDto() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Shift> getAssignedShifts() {
        return assignedShifts;
    }

    public void setAssignedShifts(List<Shift> assignedShifts) {
        this.assignedShifts = assignedShifts;
    }

    public float getWorkLoad() {
        return workLoad;
    }

    public List<Integer> getDesiredVacationDays() {
        return desiredVacationDays;
    }    
    
    public List<Integer> getVacationDays() {
        return vacationDays;
    }
}

