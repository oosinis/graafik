package com.graafik.model.Entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.graafik.converters.IntegerListConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "rules")
public class Rule extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "shift_id", referencedColumnName = "id")
    @JsonIgnore
    private Shift shift;

    @Convert(converter = IntegerListConverter.class)
    @Column(name = "days_applied")
    private List<Integer> daysApplied;

    @Column(nullable = false)
    private String name;

    private int perDay;
    private int restDays;
    private int continuousDays;

    @Enumerated(EnumType.STRING)
    private PriorityType priority;

    public Rule() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }

    public List<Integer> getDaysApplied() {
        return daysApplied;
    }

    public void setDaysApplied(List<Integer> daysApplied) {
        this.daysApplied = daysApplied;
    }

    public int getPerDay() {
        return perDay;
    }

    public void setPerDay(int perDay) {
        this.perDay = perDay;
    }

    public int getRestDays() {
        return restDays;
    }

    public void setRestDays(int restDays) {
        this.restDays = restDays;
    }

    public int getContinuousDays() {
        return continuousDays;
    }

    public void setContinuousDays(int continuousDays) {
        this.continuousDays = continuousDays;
    }

    public PriorityType getPriority() {
        return priority;
    }

    public void setPriority(PriorityType priority) {
        this.priority = priority;
    }

    public enum PriorityType {
        critical, high, medium, low
    }

    @Override
    public String toString() {
        return "Rule{" +
            "name='" + name + '\'' +
            ", daysApplied=" + daysApplied +
            ", perDay=" + perDay +
            ", restDays=" + restDays +
            ", continuousDays=" + continuousDays +
            ", priority=" + priority +
            '}';
    }
}
