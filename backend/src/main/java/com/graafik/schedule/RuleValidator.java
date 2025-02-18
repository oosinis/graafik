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

        int score = 0;

        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments())  {
            List<Rule> rules = shiftAssignment.getShift().getRules();
            WorkerDto worker = shiftAssignment.getWorker();


            int countRest = 0;
            int countPrevWork = 0;
            Shift prevWorkShift = null;

            int date = (currentSchedule.getDaySchedules() == null) ? 0 : currentSchedule.getDaySchedules().size();

            int countCont = checkContinuousNewAssignment(shiftAssignment, currentSchedule, currentDayShiftAssignments, date - 1);

            // if too many continuous days of this shift
            if (countCont <= -1) {
                return -1000;
            }

            date = date - 1 - countCont;

            for (int i = date; i >= 0; i--) {

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
                        System.out.println("\nsecond too many count");
                        System.out.println("tahan lisada: " + currentDayShiftAssignments.toString());
                        System.out.println("praegune" + currentSchedule.toString() + "\n");
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

    private static int checkContinuousNewAssignment(ShiftAssignment shiftAssignment, Schedule currentSchedule, DaySchedule currentDayShiftAssignments, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        WorkerDto worker = shiftAssignment.getWorker();
        System.out.println("\n KONTROLL: date: " + date);
        System.out.println("looking at shift: " + shiftAssignment.toString());

        for (int i = date; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
            if (previousShiftAssignment == null) return countCont;
            System.out.println("previous shift assignment: " + previousShiftAssignment.toString());
            System.out.println("on date: " + date + "\n");


            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                System.out.println("cont coutn " + countCont);
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    System.out.println("rule cont days: " + rule.getContinuousDays());
                    if (rule.getContinuousDays() > countCont) standingRules.add(rule);
                }

                if (standingRules.isEmpty()) {
                    System.out.println("\nempty rules !!!!\n");
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
        System.out.println("\n KONTROLL: date: " + date);
        System.out.println("looking at shift: " + shiftAssignment.toString());

        for (int i = date; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
            if (previousShiftAssignment == null) return countCont;
            System.out.println("previous shift assignment: " + previousShiftAssignment.toString());
            System.out.println("on date: " + date + "\n");


            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                System.out.println("cont coutn " + countCont);
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    System.out.println("rule cont days: " + rule.getContinuousDays());
                    if (rule.getContinuousDays() >= countCont) standingRules.add(rule);
                }

                if (standingRules.isEmpty()) {
                    System.out.println("\nempty rules !!!!\n");
                    return -1;
                }
                else rules = standingRules;
            } else return countCont;
        }
        return countCont;
    }
}
