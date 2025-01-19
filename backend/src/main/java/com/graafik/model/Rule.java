package com.graafik.model;

public class Rule {
    public Shift Shift;
    public int Days;
    public int PerDay;
    public int RestDays;
    public PriorityType Priority;


    public enum PriorityType {
        /// Unbreakable rule
        Critical,
        /// Can brake if very needed
        High,
        /// Can brake
        Medium,
        /// Nice to have
        Low,
    }
}
