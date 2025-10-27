package com.graafik.dto;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import com.graafik.model.Rule;

public class ShiftDTO {
    private UUID id;
    private String type;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<Rule> rules;

    public ShiftDTO() {}

    public ShiftDTO(UUID id, String type, LocalTime startTime, LocalTime endTime, List<Rule> rules) {
        this.id = id;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rules = rules;
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }


    public String getType()  {return type; }

    public LocalTime getStartTime() { return startTime; }

    public LocalTime getEndTime() { return endTime; }

    public List<Rule> getRules() { return rules; }

    public void setType(String type) { this.type = type; }

    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

   public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public void setRules(List<Rule> rules) { this.rules = rules; }
    
}
