package com.graafik.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Rule {
    @JsonProperty("daysApplied")
    private List<Integer> daysApplied;

    @JsonProperty("perDay")
    private int perDay;

    @JsonProperty("restDays")
    private int restDays;

    @JsonProperty("continuousDays")
    private int continuousDays;

    @JsonProperty("priority")
    private PriorityType priority;

    // No-args constructor (Required for Jackson)
    public Rule() {}

    // Getters
    public List<Integer> getDaysApplied() {
        return daysApplied;
    }

    public int getPerDay() {
        return perDay;
    }

    public int getRestDays() {
        return restDays;
    }

    public int getContinuousDays() {
        return continuousDays;
    }

    public PriorityType getPriority() {
        return priority;
    }

    // Setters
    public void setDaysApplied(List<Integer> daysApplied) {
        this.daysApplied = daysApplied;
    }

    public void setPerDay(int perDay) {
        this.perDay = perDay;
    }

    public void setRestDays(int restDays) {
        this.restDays = restDays;
    }

    public void setPriority(PriorityType priority) {
        this.priority = priority;
    }

    // Enum for priority
    public enum PriorityType {
        /// Unbreakable rule
        critical,
        /// Can break if very needed
        high,
        /// Can break
        medium,
        /// Nice to have
        low
    }

    // Manually implemented toString() method
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
