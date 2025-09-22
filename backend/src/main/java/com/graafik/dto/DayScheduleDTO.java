package com.graafik.dto;

import java.util.List;
import java.util.UUID;

import com.graafik.model.ShiftAssignment;

public class DayScheduleDTO {
    private UUID id;
    private int dayOfMonth;
    private int score;
    private List<UUID> assignmentIds;
    private UUID scheduleId;
}
