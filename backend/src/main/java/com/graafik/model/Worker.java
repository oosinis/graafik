package com.graafik.model;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "workers")
public class Worker extends BaseEntity {
    
    @Column(nullable = false)
    private String name;

    private float workLoad;

    private String role;

    @ElementCollection
    @CollectionTable(name = "worker_assigned_shift_ids", joinColumns = @JoinColumn(name = "worker_id"))
    @Column(name = "shift_id")
    private List<UUID> assignedShifts;

    @ElementCollection
    @CollectionTable(name = "worker_desired_vacation_days", joinColumns = @JoinColumn(name = "worker_id"))
    @Column(name = "day")
    private List<Integer> desiredVacationDays;
    
    
    @ElementCollection
    @CollectionTable(name = "worker_vacation_days", joinColumns = @JoinColumn(name = "worker_id"))
    @Column(name = "day")
    private List<Integer> vacationDays;

    @ElementCollection
    @CollectionTable(name = "worker_sick_days", joinColumns = @JoinColumn(name = "worker_id"))
    @Column(name = "day")
    private List<Integer> sickDays;


    @ElementCollection
    @CollectionTable(name = "worker_requested_work_days", joinColumns = @JoinColumn(name = "worker_id"))
    @MapKeyColumn(name = "day")
    @Column(name = "shift_id", nullable = true)
    private Map<Integer, UUID> requestedWorkDays;

    public Worker() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UUID> getAssignedShifts() {
        return assignedShifts;
    }

    public void setAssignedShifts(List<UUID> assignedShifts) {
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

    public Map<Integer, UUID> getRequestedWorkDays() {
        return requestedWorkDays;
    }    

    public void addSickDays(int newDay) {
        this.sickDays.add(newDay);
    }

    public List<Integer> getSickDays() {
        return sickDays;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Worker workerDto = (Worker) o;
        return Objects.equals(name, workerDto.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, assignedShifts, workLoad, desiredVacationDays, vacationDays, requestedWorkDays, sickDays, role);
    }
    
    @Override
    public String toString() {
        return "WorkerDto{" +
               "name='" + name + '\'' +
               '}';
    }
    
}

