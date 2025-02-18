package com.graafik.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    @JsonProperty("requestedWorkDays")
    private Map<Integer, Shift> requestedWorkDays;   

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

    public Map<Integer, Shift> getRequestedWorkDays() {
        return requestedWorkDays;
    }    

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WorkerDto workerDto = (WorkerDto) o;
        return Objects.equals(name, workerDto.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, assignedShifts, workLoad, desiredVacationDays, vacationDays, requestedWorkDays);
    }
    
    @Override
    public String toString() {
        return "WorkerDto{" +
               "name='" + name + '\'' +
               '}';
    }
    
}

