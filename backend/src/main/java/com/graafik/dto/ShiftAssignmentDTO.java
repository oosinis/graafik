package com.graafik.dto;
import java.util.UUID;

public class ShiftAssignmentDTO {
    private UUID id;
    private UUID workerId;
    private UUID dayScheduleId;

    public ShiftAssignmentDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getWorkerId() {
        return workerId;
    }

    public void setWorkerId(UUID workerId) {
        this.workerId = workerId;
    }

    public UUID getDayScheduleId() {
        return dayScheduleId;
    }

    public void setDayScheduleId(UUID dayScheduleId) {
        this.dayScheduleId = dayScheduleId;
    }
}
