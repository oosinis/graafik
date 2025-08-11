package com.graafik.schedule;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;

public class ScheduleExample {
    public static void main(String[] args) throws Exception {
        String json = "{ \"month\": 3, \"year\": 2025, \"fullTimeHours\": 1, \"workers\": [ { \"id\": \"worker-uuid\", \"name\": \"John Doe\", \"vacationDays\": [], \"sickDays\": [] } ], \"shifts\": [ { \"id\": \"shift-uuid\", \"type\": \"Morning\", \"duration\": 1, \"rules\": [] } ] }";

        ObjectMapper objectMapper = new ObjectMapper();

        ScheduleRequest request = objectMapper.readValue(json, ScheduleRequest.class);

        List<Schedule> schedules = GenerateSchedule.generateSchedule(request);

        // Now you can save or process schedules
        System.out.println("Generated schedules: " + schedules.size());
    }
}
