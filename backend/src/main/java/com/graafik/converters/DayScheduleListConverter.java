package com.graafik.converters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.DaySchedule;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;

@Converter
public class DayScheduleListConverter implements AttributeConverter<List<DaySchedule>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<DaySchedule> daySchedules) {
        try {
            return objectMapper.writeValueAsString(daySchedules);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert DaySchedules to JSON", e);
        }
    }

    @Override
    public List<DaySchedule> convertToEntityAttribute(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<DaySchedule>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to DaySchedules", e);
        }
    }
}
