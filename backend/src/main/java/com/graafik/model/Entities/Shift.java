package com.graafik.model.Entities;


import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "shifts")
public class Shift extends BaseEntity {

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private LocalTime startTime;
    @Column(nullable = false)
    private LocalTime endTime;

    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rule> rules = new ArrayList<>();

    public Shift() {}

    public Shift(String name, LocalTime startTime, LocalTime endTime, List<Rule> rules) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rules = rules;
    }

    public String getName()  {return name; }

    public LocalTime getStartTime() { return startTime; }

    public LocalTime getEndTime() { return endTime; }

    public List<Rule> getRules() { return rules; }

    public void setName(String type) { this.name = type; }

    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

   public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public void setRules(List<Rule> rules) { this.rules = rules; }

    public long getDurationInMinutes() {
        return java.time.Duration.between(startTime, endTime).toMinutes();
    }
    
}
