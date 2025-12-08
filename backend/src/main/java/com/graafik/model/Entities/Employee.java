package com.graafik.model.Entities;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "employees")
public class Employee extends BaseEntity {
    
    @Column(nullable = false)
    private String name;

    private float workLoad;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "secondary_role_id")
    private Role secondaryRole;

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

    private String email;
    private String phone;
    private String notes;

    @ElementCollection
    @CollectionTable(name = "employee_preferred_shifts", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "shift_type")
    private List<String> preferredShifts;

    @ElementCollection
    @CollectionTable(name = "employee_preferred_workdays", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<String> preferredWorkdays;

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

    public Map<Integer, UUID> getRequestedWorkDays() {
        return requestedWorkDays;
    }    

    public void addSickDays(int newDay) {
        this.sickDays.add(newDay);
    }

    public List<Integer> getSickDays() {
        return sickDays;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Role getSecondaryRole() {
        return secondaryRole;
    }

    public void setSecondaryRole(Role secondaryRole) {
        this.secondaryRole = secondaryRole;
    }

    public List<String> getPreferredShifts() {
        return preferredShifts;
    }

    public void setPreferredShifts(List<String> preferredShifts) {
        this.preferredShifts = preferredShifts;
    }

    public List<String> getPreferredWorkdays() {
        return preferredWorkdays;
    }

    public void setPreferredWorkdays(List<String> preferredWorkdays) {
        this.preferredWorkdays = preferredWorkdays;
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
        return Objects.hash(name, assignedShifts, workLoad, desiredVacationDays, vacationDays, requestedWorkDays, sickDays, role);
    }
    
    @Override
    public String toString() {
        return "Employee{" +
               "name='" + name + '\'' +
               '}';
    }
    
}

