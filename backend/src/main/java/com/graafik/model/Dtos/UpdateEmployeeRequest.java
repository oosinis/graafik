package com.graafik.model.Dtos;

import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true) // Ignore all fields not in this DTO
public class UpdateEmployeeRequest {
    private String name;
    private String email;
    private String phone;
    private String employeeRole;
    private String secondaryRole;
    private Float workLoad;
    private String notes;
    private List<String> preferredShifts;
    private List<String> preferredWorkdays;

    @JsonProperty("assignedShifts") // Map frontend's "assignedShifts" to this field
    private List<UUID> assignedShiftIds; // Accept IDs instead of full objects

    public UpdateEmployeeRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
    }

    public String getSecondaryRole() {
        return secondaryRole;
    }

    public void setSecondaryRole(String secondaryRole) {
        this.secondaryRole = secondaryRole;
    }

    public Float getWorkLoad() {
        return workLoad;
    }

    public void setWorkLoad(Float workLoad) {
        this.workLoad = workLoad;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    // Getter for the field (used by Jackson)
    @JsonProperty("assignedShifts")
    public List<UUID> getAssignedShiftIds() {
        return assignedShiftIds;
    }

    // Setter for the field (used by Jackson) - must match @JsonProperty name
    @JsonProperty("assignedShifts")
    public void setAssignedShiftIds(List<UUID> assignedShiftIds) {
        this.assignedShiftIds = assignedShiftIds;
    }
}
