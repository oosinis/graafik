package com.backend.graafik.data;

import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

public class WorkerConverter {

    // Method to convert JSON to a list of Worker objects
    public static List<Worker> convertJsonToWorkersFromFile(String filePath, int fullTimeHours) throws IOException {

        String json = new String(Files.readAllBytes(Paths.get(filePath)));

        ObjectMapper objectMapper = new ObjectMapper();

        // Parse the JSON into a map
        Map<String, Object> map = objectMapper.readValue(json, Map.class);

        // Extract the workers array from the JSON
        List<Map<String, Object>> workersList = (List<Map<String, Object>>) map.get("workers");

        List<Worker> workerObjects = new ArrayList<>();

        for (Map<String, Object> workerData : workersList) {

            int employeeId = parseInt(workerData.get("id"));
            String name = (String) workerData.get("name");
            double workLoad = ((Number) workerData.get("workLoad")).doubleValue();
            int workLoadHours = (int) (fullTimeHours * workLoad);
            int hoursBalance = (int) workerData.get("hoursBalance");

            int lastMonthLastDayHours = 0;
            Object lastMonthLastDayHoursObj = workerData.get("lastMonthLastDayHours");

            if (lastMonthLastDayHoursObj instanceof Boolean) {
                lastMonthLastDayHours = (Boolean) lastMonthLastDayHoursObj ? 8 : 0;
            } else {
                System.err.println("Unexpected format for lastMonthLastDayHours: " + lastMonthLastDayHoursObj);
            }

            List<Integer> vacationDays = (List<Integer>) workerData.get("vacationDays");
            List<Integer> desiredVacationDays = (List<Integer>) workerData.get("desiredVacationDays");

            HashMap<Integer, Shift> desiredWorkDays = new HashMap<>();
            List<Map<String, Object>> desiredWorkDaysData = (List<Map<String, Object>>) workerData.get("desiredWorkDays");
            for (Map<String, Object> dayData : desiredWorkDaysData) {
                Integer day = (Integer) dayData.get("day");
                Integer duration = (Integer) dayData.get("duration");
                // Set shift type to OSAKOND every time
                if (name.equals("Kai")) desiredWorkDays.put(day, new Shift(duration, Shift.INTENSIIV));
                else desiredWorkDays.put(day, new Shift(duration, Shift.OSAKOND));
            }

            List<Integer> sickLeaveDays = (List<Integer>) workerData.get("sickLeaveDays");
            List<Integer> trainingDays = (List<Integer>) workerData.get("trainingDays");

            Worker worker = new Worker(employeeId, name, workLoadHours, workLoad, hoursBalance, lastMonthLastDayHours, vacationDays, desiredVacationDays, desiredWorkDays, sickLeaveDays, trainingDays);
            workerObjects.add(worker);
        }

        return workerObjects;
    }

    private static int parseInt(Object id) {
        if (id instanceof Integer) {
            return (int) id;
        } else if (id instanceof String) {
            try {
                return Integer.parseInt((String) id);
            } catch (NumberFormatException e) {
                System.err.println("Invalid ID format: " + id);
                return 0;
            }
        }
        return 0;  // Default fallback value if it's neither Integer nor String
    }

    // Method to load workers and print them
    public static List<Worker> createWorkersList(int fullTimeHours) {
        // Path to the JSON file
        String filePath = "src/main/java/com/backend/graafik/data/db/db.json";
        List<Worker> workers = new ArrayList<>();

        try {
            // Call the method to convert JSON to list of workers
            workers = convertJsonToWorkersFromFile(filePath, fullTimeHours);

            // Example: Print out the list of workers
            for (Worker worker : workers) {
                System.out.println(worker);  // You can also print specific fields like worker.getName(), etc.
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return workers;
    }
}
