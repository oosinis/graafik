package com.backend.graafik.model;

import java.util.List;

public class ScheduleRequest {
    public List<Worker> Workers;
    public List<Shift> Shifts;
    public int Month;
    public int FullTimeHours;
    public List<Rule> Rules;
}
