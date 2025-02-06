package com.graafik.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Shift {

    @JsonProperty("type")
    private String type;

    @JsonProperty("duration")
    private int duration;

    @JsonProperty("rules")
    
    List<Rule> rules;
    public Shift() {}

    // Getters
    public String getType() {
        return type;
    }

    public int getDuration() {
        return duration;
    }

    public List<Rule> getRules() {
        return rules;
    }

    // Setters
    public void setType(String type) {
        this.type = type;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setRules(List<Rule> rules) {
        this.rules = rules;
    }
}
