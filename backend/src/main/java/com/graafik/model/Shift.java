package com.graafik.model;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;


@Entity
@Table(name = "shifts")
public class Shift extends BaseEntity {

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private int duration;

    @ElementCollection
    @CollectionTable(name = "shift_rules", joinColumns = @JoinColumn(name = "shift_id"))
    private List<Rule> rules;

    public Shift() {}

    public String getType() {
        return type;
    }

    public int getDuration() {
        return duration;
    }

    public List<Rule> getRules() {
        return rules;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setRules(List<Rule> rules) {
        this.rules = rules;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Shift shift = (Shift) o;
        return duration == shift.duration && type.equals(shift.type);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, duration);
    }

    @Override
    public String toString() {
        return "Shift{" +
               "type='" + type + '\'' +
               ", duration=" + duration +
               ", rules=" + rules +
               '}';
    }
    
}
