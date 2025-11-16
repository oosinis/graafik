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
    private String type;
    @Column(nullable = false)
    private LocalTime startTime;
    @Column(nullable = false)
    private LocalTime endTime;

    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rule> rules = new ArrayList<>();

    public Shift() {}

    public Shift(String type, LocalTime startTime, LocalTime endTime, List<Rule> rules) {
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rules = rules;
    }

    public String getType()  {return type; }

    public LocalTime getStartTime() { return startTime; }

    public LocalTime getEndTime() { return endTime; }

    public List<Rule> getRules() { return rules; }

    public void setType(String type) { this.type = type; }

    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

   public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public void setRules(List<Rule> rules) { this.rules = rules; }
    
}
