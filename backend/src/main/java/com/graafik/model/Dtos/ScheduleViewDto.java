package com.graafik.model.Dtos;

import java.util.List;

public class ScheduleViewDto {
    private String startDate; // ISO date
    private String endDate;   // ISO date
    private List<ScheduleAssignmentDto> assignments;

    public ScheduleViewDto() {}

    public ScheduleViewDto(String startDate, String endDate, List<ScheduleAssignmentDto> assignments) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.assignments = assignments;
    }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public List<ScheduleAssignmentDto> getAssignments() { return assignments; }
    public void setAssignments(List<ScheduleAssignmentDto> assignments) { this.assignments = assignments; }
}

