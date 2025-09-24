package com.graafik.model;

import java.util.List;
import java.util.UUID;

import com.graafik.converters.IntegerListConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "rules")
public class Rule extends BaseEntity {

    @Column(name =  "shift_id")
    private UUID shiftId;

    @Convert(converter = IntegerListConverter.class)
    @Column(name = "days_applied")
    private List<Integer> daysApplied;

    private int perDay;
    private int restDays;
    private int continuousDays;

    @Enumerated(EnumType.STRING)
    private PriorityType priority;

    public Rule() {}

    public UUID getShiftId() {
        return shiftId;
    }

    public void setShiftId(UUID shiftId) {
        this.shiftId = shiftId;
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
                "daysApplied=" + daysApplied +
                ", perDay=" + perDay +
                ", restDays=" + restDays +
                ", continuousDays=" + continuousDays +
                ", priority=" + priority +
                '}';
    }
}
