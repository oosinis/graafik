package com.graafik.model.Entities;

import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "employees")
public class Employee extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private float workLoad;

    private String employeeRole;

    @ManyToMany
    @JoinTable(name = "employee_shifts", joinColumns = @JoinColumn(name = "employee_id"), inverseJoinColumns = @JoinColumn(name = "shift_id"))
    private List<Shift> assignedShifts;

    @JsonIgnore
    @ElementCollection
    @CollectionTable(name = "employee_desired_work_days", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<String> desiredWorkDays;

    @JsonIgnore
    @ElementCollection
    @CollectionTable(name = "employee_requested_days_off", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<String> requestedDaysOff;

    @JsonIgnore
    @ElementCollection
    @CollectionTable(name = "employee_vacation_days", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<String> vacationDays;

    @JsonIgnore
    @ElementCollection
    @CollectionTable(name = "employee_sick_days", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<String> sickDays;

    private String email;
    private String phone;
    private String notes;
    private String secondaryRole;

    @ElementCollection
    @CollectionTable(name = "employee_preferred_shifts", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "shift_type")
    private List<String> preferredShifts;

    @ElementCollection
    @CollectionTable(name = "employee_preferred_workdays", joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "day")
    private List<String> preferredWorkdays;

    public Employee() {
    }

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

    public List<String> getDesiredWorkDays() {
        return desiredWorkDays;
    }

    public void setDesiredWorkDays(List<String> desiredWorkDays) {
        this.desiredWorkDays = desiredWorkDays;
    }

    public List<String> getRequestedDaysOff() {
        return requestedDaysOff;
    }

    public void setRequestedDaysOff(List<String> requestedDaysOff) {
        this.requestedDaysOff = requestedDaysOff;
    }

    public List<String> getVacationDays() {
        return vacationDays;
    }

    public void setVacationDays(List<String> vacationDays) {
        this.vacationDays = vacationDays;
    }

    public List<String> getSickDays() {
        return sickDays;
    }

    public void setSickDays(List<String> sickDays) {
        this.sickDays = sickDays;
    }

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
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

    public String getSecondaryRole() {
        return secondaryRole;
    }

    public void setSecondaryRole(String secondaryRole) {
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
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Employee employee = (Employee) o;
        return Objects.equals(name, employee.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, assignedShifts, workLoad, desiredWorkDays, requestedDaysOff, vacationDays, sickDays,
                employeeRole);
    }

    @Override
    public String toString() {
        return "Employee{" +
                "name='" + name + '\'' +
                '}';
    }

}
