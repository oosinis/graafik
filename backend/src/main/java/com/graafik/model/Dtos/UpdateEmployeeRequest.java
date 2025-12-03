package com.graafik.model.Dtos;

import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)  // Ignore all fields not in this DTO
public class UpdateEmployeeRequest {
    private String name;
    private String employeeRole;
    
    @JsonProperty("assignedShifts")  // Map frontend's "assignedShifts" to this field
    private List<UUID> assignedShiftIds;  // Accept IDs instead of full objects
    
    public UpdateEmployeeRequest() {}
    
    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }
    
    public String getEmployeeRole() { 
        return employeeRole; 
    }
    
    public void setEmployeeRole(String employeeRole) { 
        this.employeeRole = employeeRole; 
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
