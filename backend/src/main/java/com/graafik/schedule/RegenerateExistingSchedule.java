package com.graafik.schedule;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.DaySchedule;
import com.graafik.model.ScheduleAlg;
import com.graafik.model.ScheduleRequestAlg;
import com.graafik.model.ShiftAlg;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;

public class RegenerateExistingSchedule {

    // init for testing, for actual use: regenerateSchedule
    public static void initRegenerateSchedule(String[] args) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            File jsonFile = new File("backend/src/main/java/com/graafik/data/db/schedulerequest.json");
            List<ScheduleRequestAlg> scheduleRequests = objectMapper.readValue(jsonFile, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, ScheduleRequestAlg.class));

            ScheduleAlg schedule = new ScheduleAlg();

            ScheduleRequestAlg scheduleRequest = scheduleRequests.get(0);

            Worker workerDto = scheduleRequest.getWorkers().get(0);

            List<ScheduleAlg> schedules = regenerateSchedule(scheduleRequest, schedule, 0, 0, workerDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Regenerate schedule without one worker
     * @param scheduleRequest original request
     * @param currentSchedule the schedule to be changed
     * @param startDate starting date for chnge (included)
     * @param endDate ending date for change (included)
     * @param missingWorker worker to be removed
     * @return list of new schedules with new scores
     */
    public static List<ScheduleAlg> regenerateSchedule(ScheduleRequestAlg scheduleRequest, ScheduleAlg currentSchedule, int startDate, int endDate, Worker missingWorker) {

        List<ShiftAlg> missingShifts = new ArrayList<>();
        for (int date = startDate - 1; date < endDate; date++) {
            DaySchedule daySchedule = null;
            for (DaySchedule ds : currentSchedule.getDaySchedules()) {
                if (ds.getDayOfMonth() == date) {
                    daySchedule = ds;
                    break;
                }
            }
            List<ShiftAssignment> assignments = currentSchedule.getDaySchedules().get(date).getAssignments();
            ShiftAssignment toRemove = assignments.stream()
                .filter(a -> a.getWorker() == missingWorker)
                .findFirst()
                .orElse(null);

            if (toRemove != null) {
                missingShifts.add(toRemove.getShift());
                assignments.remove(toRemove);
                currentSchedule.changeWorkerHours(toRemove.getShift().getDurationInMinutes(), missingWorker.getId());
            } else missingShifts.add(null);
        }

        // new score count to differentite between regenerations
        // not abs necessary but i think makes thing cleaner
        currentSchedule.setScore(0);
        List<ScheduleAlg> partialSchedules = Collections.singletonList(currentSchedule);
        for (int date = startDate - 1; date < endDate; date++) {
            if (missingShifts.getFirst() != null) partialSchedules = generateNewScheduleForDate(scheduleRequest, partialSchedules, date, missingWorker, missingShifts.getFirst());
            missingShifts.removeFirst();
        }
        return partialSchedules;
    }


    /**
     * 
     * @param scheduleRequest origingal request
     * @param partialSchedules list of scheules to add new day to
     * @param date specific date we're currently adding to
     * @param missingWorker 
     * @param missingShift mising shift from the date
     * @return new schedules wth the missing shift added to current date (different worker for each schedule in list)
     */
    public static List<ScheduleAlg> generateNewScheduleForDate(ScheduleRequestAlg scheduleRequest, List<ScheduleAlg> partialSchedules, int date, Worker missingWorker, ShiftAlg missingShift) {
    
        List<ScheduleAlg> newPartialSchedules = new ArrayList<>();
        for (ScheduleAlg currentSchedule : partialSchedules) {

            for (Worker worker : scheduleRequest.getWorkers()) {

                if (worker == missingWorker || worker.getVacationDays().contains(date + 1) || worker.getSickDays().contains(date + 1)) continue;
                if (!RuleValidator.initialValidator(HelperMethods.getRequestedWorkDays(scheduleRequest, date), missingShift, worker)) continue;
                
                ScheduleAlg clonedSchedule = HelperMethods.cloneSchedule(currentSchedule);
                
                clonedSchedule.setScore(RuleValidator.singleAssignmentValidator(scheduleRequest, clonedSchedule, new ShiftAssignment(missingShift, worker), date));

                clonedSchedule.changeWorkerHours(- missingShift.getDurationInMinutes(), worker.getId());

                clonedSchedule.getDaySchedules().get(date).getAssignments().add(new ShiftAssignment(missingShift, worker));

                newPartialSchedules.add(clonedSchedule);

            }
        }
        return newPartialSchedules;
    }

    
}
