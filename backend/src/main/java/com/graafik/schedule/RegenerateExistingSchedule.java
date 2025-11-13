package com.graafik.schedule;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.graafik.model.Domain.DayScheduleAlg;
import com.graafik.model.Domain.ScheduleAlg;
import com.graafik.model.Domain.ScheduleRequestAlg;
import com.graafik.model.Domain.ShiftAlg;
import com.graafik.model.Domain.ShiftAssignmentAlg;
import com.graafik.model.Entities.Employee;

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

            Employee employeeDto = scheduleRequest.getEmployees().get(0);

            List<ScheduleAlg> schedules = regenerateSchedule(scheduleRequest, schedule, 0, 0, employeeDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Regenerate schedule without one employee
     * @param scheduleRequest original request
     * @param currentSchedule the schedule to be changed
     * @param startDate starting date for chnge (included)
     * @param endDate ending date for change (included)
     * @param missingEmployee employee to be removed
     * @return list of new schedules with new scores
     */
    public static List<ScheduleAlg> regenerateSchedule(ScheduleRequestAlg scheduleRequest, ScheduleAlg currentSchedule, int startDate, int endDate, Employee missingEmployee) {

        List<ShiftAlg> missingShifts = new ArrayList<>();
        for (int date = startDate - 1; date < endDate; date++) {
            DayScheduleAlg daySchedule = null;
            for (DayScheduleAlg ds : currentSchedule.getAlgDaySchedules()) {
                if (ds.getDayOfMonth() == date) {
                    daySchedule = ds;
                    break;
                }
            }
            List<ShiftAssignmentAlg> assignments = currentSchedule.getAlgDaySchedules().get(date).getAlgAssignments();
            ShiftAssignmentAlg toRemove = assignments.stream()
                .filter(a -> a.getEmployee() == missingEmployee)
                .findFirst()
                .orElse(null);

            if (toRemove != null) {
                missingShifts.add(toRemove.getShiftAlg());
                assignments.remove(toRemove);
                currentSchedule.changeEmployeeHours(toRemove.getShiftAlg().getDurationInMinutes(), missingEmployee.getId());
            } else missingShifts.add(null);
        }

        // new score count to differentite between regenerations
        // not abs necessary but i think makes thing cleaner
        currentSchedule.setScore(0);
        List<ScheduleAlg> partialSchedules = Collections.singletonList(currentSchedule);
        for (int date = startDate - 1; date < endDate; date++) {
            if (missingShifts.getFirst() != null) partialSchedules = generateNewScheduleForDate(scheduleRequest, partialSchedules, date, missingEmployee, missingShifts.getFirst());
            missingShifts.removeFirst();
        }
        return partialSchedules;
    }


    /**
     * 
     * @param scheduleRequest origingal request
     * @param partialSchedules list of scheules to add new day to
     * @param date specific date we're currently adding to
     * @param missingEmployee 
     * @param missingShift mising shift from the date
     * @return new schedules wth the missing shift added to current date (different employee for each schedule in list)
     */
    public static List<ScheduleAlg> generateNewScheduleForDate(ScheduleRequestAlg scheduleRequest, List<ScheduleAlg> partialSchedules, int date, Employee missingEmployee, ShiftAlg missingShift) {
    
        List<ScheduleAlg> newPartialSchedules = new ArrayList<>();
        for (ScheduleAlg currentSchedule : partialSchedules) {

            for (Employee employee : scheduleRequest.getEmployees()) {

                if (employee == missingEmployee || employee.getVacationDays().contains(date + 1) || employee.getSickDays().contains(date + 1)) continue;
                if (!RuleValidator.initialValidator(HelperMethods.getRequestedWorkDays(scheduleRequest, date), missingShift, employee)) continue;
                
                ScheduleAlg clonedSchedule = HelperMethods.cloneSchedule(currentSchedule);
                
                clonedSchedule.setScore(RuleValidator.singleAssignmentValidator(scheduleRequest, clonedSchedule, new ShiftAssignmentAlg(missingShift, employee), date));

                clonedSchedule.changeEmployeeHours(- missingShift.getDurationInMinutes(), employee.getId());

                clonedSchedule.getAlgDaySchedules().get(date).getAlgAssignments().add(new ShiftAssignmentAlg(missingShift, employee));

                newPartialSchedules.add(clonedSchedule);

            }
        }
        return newPartialSchedules;
    }

    
}
