package com.graafik.model.Dtos;

import java.util.UUID;

public class ScheduleAssignmentDto {
    private UUID employeeId;
    private String employeeName;
    private String date; // ISO date yyyy-mm-dd
    private UUID shiftId;
    private String shiftName;
    private String shiftColor;
    private String shiftBg;
    private String startTime; // HH:MM
    private String endTime;   // HH:MM
    private boolean isDayOff;

    public ScheduleAssignmentDto() {}

    public ScheduleAssignmentDto(UUID employeeId, String employeeName, String date, UUID shiftId, 
                                  String shiftName, String shiftColor, String shiftBg, 
                                  String startTime, String endTime, boolean isDayOff) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.date = date;
        this.shiftId = shiftId;
        this.shiftName = shiftName;
        this.shiftColor = shiftColor;
        this.shiftBg = shiftBg;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isDayOff = isDayOff;
    }

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public UUID getShiftId() { return shiftId; }
    public void setShiftId(UUID shiftId) { this.shiftId = shiftId; }

    public String getShiftName() { return shiftName; }
    public void setShiftName(String shiftName) { this.shiftName = shiftName; }

    public String getShiftColor() { return shiftColor; }
    public void setShiftColor(String shiftColor) { this.shiftColor = shiftColor; }

    public String getShiftBg() { return shiftBg; }
    public void setShiftBg(String shiftBg) { this.shiftBg = shiftBg; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public boolean isDayOff() { return isDayOff; }
    public void setDayOff(boolean isDayOff) { this.isDayOff = isDayOff; }
}

