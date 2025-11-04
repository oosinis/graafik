package com.graafik.model;

import java.util.List;
import java.util.Objects;
import java.util.UUID;


public class ShiftAlg {
    private UUID id;

    private String type;

    private long durationInMinutes;

    private List<Rule> rules;

    public ShiftAlg() {}

    public ShiftAlg(UUID id, String type,  long durationInMinutes, List<Rule> rules) {
        this.id = id;
        this.type = type;
        this.durationInMinutes = durationInMinutes;
        this.rules = rules;
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getType() {
        return type;
    }

    public long getDurationInMinutes() {
        return durationInMinutes;
    }

    public List<Rule> getRules() {
        return rules;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDurationInMinutes(int duration) {
        this.durationInMinutes = duration;
    }

    public void setRules(List<Rule> rules) {
        this.rules = rules;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShiftAlg shift = (ShiftAlg) o;
        return durationInMinutes == shift.durationInMinutes && type.equals(shift.type);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, durationInMinutes);
    }

    @Override
    public String toString() {
        return "Shift{" +
               "type='" + type + '\'' +
               ", duration=" + durationInMinutes +
               ", rules=" + rules +
               '}';
    }
    
}
