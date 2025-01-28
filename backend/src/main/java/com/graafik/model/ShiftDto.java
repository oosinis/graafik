package com.graafik.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ShiftDto {

    @JsonProperty("type") // Maps the JSON field "type" to this field
    private String type;

    @JsonProperty("duration") // Maps the JSON field "duration" to this field
    private int duration;

    // No-args constructor (required for Jackson deserialization)
    public ShiftDto() {}

    // Getters
    public String getType() {
        return type;
    }

    public int getDuration() {
        return duration;
    }

    // Setters
    public void setType(String type) {
        this.type = type;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}
