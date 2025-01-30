package com.graafik.model;

import java.util.List;

public class Schedule {
    private int month;
    private int year;
    private List<DaySchedule> daySchedules;
}

public class DaySchedule {
    private int dayOfMonth;
    private List<ShiftAssignment> assignments;
}

public class ShiftAssignment {
    private ShiftDto shift;
    private WorkerDto worker;
}
