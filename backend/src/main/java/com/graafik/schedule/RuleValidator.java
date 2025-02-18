package com.graafik.schedule;

import com.graafik.model.DaySchedule;
import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.WorkerDto;
import java.util.ArrayList;
import java.util.List;



public class RuleValidator {
    
    public static int validator(ScheduleRequest scheduleRequest, Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        
        currentDayShiftAssignments.setScore(0);

        // look through assignments for a day
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments())  {

            WorkerDto worker = shiftAssignment.getWorker();

            int countRest = 0;
            int countPrevWork = 0;
            Shift prevWorkShift = null;


            int newDayScheduleDate = (currentSchedule.getDaySchedules() == null) ? 0 : currentSchedule.getDaySchedules().size();
            
            // TODO: kui palju see score täpselt muutub
            if (worker.getDesiredVacationDays().contains(newDayScheduleDate)) {
                currentSchedule.addToScore(-10);
                currentDayShiftAssignments.addToScore(-10);
            }

            int countCont = checkContinuousNewAssignment(shiftAssignment, currentSchedule, currentDayShiftAssignments, newDayScheduleDate - 1);

            // if too many continuous days of this shift
            if (countCont <= -1) return -1000;

            newDayScheduleDate = newDayScheduleDate - 1 - countCont;

            // check if we have necessary rest days to assign this new shift
            for (int i = newDayScheduleDate; i >= 0; i--) {

                DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
                ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
                
                // if the worker has nothing asigned on the previous day
                if (previousShiftAssignment == null) {
                    countRest++;
                    continue;
                } 
                else {
                    prevWorkShift = previousShiftAssignment.getShift();
                    countPrevWork = checkContinuous(previousShiftAssignment, currentSchedule, currentDayShiftAssignments, i);
                    if (countPrevWork == -1) {
                        return -1000;
                    }
                    else {
                        for (Rule rule : prevWorkShift.getRules()) {
                            if (rule.getContinuousDays() > countCont && rule.getRestDays() <= countRest) continue;
                        } return -1000;
                    }

                }

            }
        }
        return currentSchedule.getScore();
    }

    private static int checkContinuousNewAssignment(ShiftAssignment shiftAssignment, Schedule currentSchedule, DaySchedule currentDayShiftAssignments, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        WorkerDto worker = shiftAssignment.getWorker();

        for (int i = date; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
            if (previousShiftAssignment == null) return countCont;

            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    if (rule.getContinuousDays() > countCont) standingRules.add(rule);
                }

                if (standingRules.isEmpty()) {
                    return -1;
                }
                else rules = standingRules;
            } else return countCont;
        }
        return countCont;
    }

    private static int checkContinuous(ShiftAssignment shiftAssignment, Schedule currentSchedule, DaySchedule currentDayShiftAssignments, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        WorkerDto worker = shiftAssignment.getWorker();

        for (int i = date; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
            if (previousShiftAssignment == null) return countCont;

            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    if (rule.getContinuousDays() >= countCont) standingRules.add(rule);
                }

                if (standingRules.isEmpty()) {
                    return -1;
                }
                else rules = standingRules;
            } else return countCont;
        }
        return countCont;
    }
}
