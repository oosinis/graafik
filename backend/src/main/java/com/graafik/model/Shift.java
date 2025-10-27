package com.graafik.model;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;


@Entity
@Table(name = "shifts")
public class Shift extends BaseEntity {

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private long durationInMinutes;

    @Transient
    private List<Rule> rules;

    public Shift() {}

    public Shift(String type,  long durationInMinutes, List<Rule> rules) {
        this.type = type;
        this.durationInMinutes = durationInMinutes;
        this.rules = rules;
    }

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
        Shift shift = (Shift) o;
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
