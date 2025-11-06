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
@Table(name = "employees")
public class Employee extends BaseEntity {
    
    @Column(nullable = false)
    private String name;

    private float workLoad;

    private String employeeRole;

    @ManyToMany
    @JoinTable(
        name = "employee_shifts",
        joinColumns = @JoinColumn(name = "employee_id"),
        inverseJoinColumns = @JoinColumn(name = "shift_id")
    )
    private List<Shift> assignedShifts;
    
    @ElementCollection
    @CollectionTable(name = "employee_desired_vacation_days", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<Integer> desiredVacationDays;
    
    @ElementCollection
    @CollectionTable(name = "employee_vacation_days", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<Integer> vacationDays;

    @ElementCollection
    @CollectionTable(name = "employee_sick_days", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<Integer> sickDays;

    @ElementCollection
    @CollectionTable(name = "employee_requested_work_days", joinColumns = @JoinColumn(name = "employee_id"))
    @MapKeyColumn(name = "day")
    @Column(name = "shift_id", nullable = true)
    private Map<Integer, UUID> requestedWorkDays;

    // Kas selle (Map<Integer, UUID> requestedWorkDay) saab asendada nt sellega?
    // @Entity
    // @Table(name = "employee_requested_work_days")
    // public class WorkDayRequest extends BaseEntity {
        
    //     @ManyToOne
    //     @JoinColumn(name = "employee_id")
    //     private Employee employee;
        
    //     @Column(name = "day")
    //     private Integer day;
        
    //     @ManyToOne
    //     @JoinColumn(name = "shift_id")
    //     private Shift shift; // Full Shift object, not just UUID
    // }

    public Employee() {}

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

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return Objects.equals(name, employee.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, assignedShifts, workLoad, desiredVacationDays, vacationDays, requestedWorkDays, sickDays, employeeRole);
    }
    
    @Override
    public String toString() {
        return "Employee{" +
               "name='" + name + '\'' +
               '}';
    }
    
}

