package com.graafik.schedule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.graafik.model.DaySchedule;
import com.graafik.model.Rule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.WorkerDto;



public class RuleValidator {
    
    public static int validator(ScheduleRequest scheduleRequest, Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {

        int score = 0;

        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments())  {
            List<Rule> rules = shiftAssignment.getShift().getRules();
            WorkerDto worker = shiftAssignment.getWorker();


            int countRest = 0;
            int countPrevWork = 0;
            Shift prevWorkShift = null;

            int daySchedulesSize = (currentSchedule.getDaySchedules() == null) ? 0 : currentSchedule.getDaySchedules().size();

            int countCont = checkContinuous(shiftAssignment, currentSchedule, currentDayShiftAssignments, daySchedulesSize - 1);

            // if too many continuous days of this shift
            if (countCont == -1) {
                System.out.println("too many cont");
                System.out.println(currentSchedule.toString());
                return -1000;
            }

            for (int i = daySchedulesSize - 1 - countCont; i >= 0; i--) {

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
                        System.out.println("too many count 2");
                        return -1000;
                    }
                    else {
                        for (Rule rule : prevWorkShift.getRules()) {
                            if (rule.getContinuousDays() >= countCont && rule.getRestDays() >= countRest) return score;
                        } return -1000;
                    }

                }

            }

        

        }
        return 0;
    }

    private static int checkContinuous(ShiftAssignment shiftAssignment, Schedule currentSchedule, DaySchedule currentDayShiftAssignments, int startingPoint) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        WorkerDto worker = shiftAssignment.getWorker();

        for (int i = startingPoint; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
            if (previousShiftAssignment == null) return countCont;
            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    if (rule.getContinuousDays() <= countCont) standingRules.add(rule);
                }

                if (standingRules.isEmpty()) return -1;
                else rules = standingRules;
            } else return countCont;
        }
        return countCont;
    }
}
