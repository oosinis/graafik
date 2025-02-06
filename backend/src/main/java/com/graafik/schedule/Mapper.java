package com.graafik.schedule;

import java.io.File;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.Rule;
import com.graafik.model.Shift;



public class Mapper {
    public static void main(String[] args) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Read JSON from a file
            File jsonFile = new File("../data/db/shifts.json");  // Make sure your file path is correct
            
            // Deserialize JSON into a list of Shift objects
            List<Shift> shifts = objectMapper.readValue(jsonFile, objectMapper.getTypeFactory().constructCollectionType(List.class, Shift.class));
            
            // Print out the data
            for (Shift shift : shifts) {
                System.out.println("Shift Type: " + shift.getType());
                System.out.println("Duration: " + shift.getDuration());
                for (Rule rule : shift.getRules()) {
                    System.out.println("  Rule Priority: " + rule.getPriority());
                    System.out.println("  Days Applied: " + rule.getDaysApplied());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
