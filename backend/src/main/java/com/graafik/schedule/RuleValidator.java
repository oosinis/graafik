package com.graafik.schedule;

import java.util.ArrayList;
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
        
        currentDayShiftAssignments.setScore(0);

        // look through assignments for a day
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments())  {

            WorkerDto worker = shiftAssignment.getWorker();

            // rest days in  row
            int countRest = 0;

            // continuous days of work before previous rest
            int countPrevWork = 0;
            // and the shift tht they were working
            Shift prevWorkShift = null;

            // date of the currentsly observable day
            int newDayScheduleDate = (currentSchedule.getDaySchedules() == null) ? 0 : currentSchedule.getDaySchedules().size();
            
            checkDesiredVacationDays(worker, newDayScheduleDate, currentSchedule, currentDayShiftAssignments);
            checkWorkerHours(shiftAssignment, currentSchedule, currentDayShiftAssignments);

            // check how mny days in a row the current assignment is
            int countCont = checkContinuousNewAssignment(shiftAssignment, currentSchedule, currentDayShiftAssignments, newDayScheduleDate - 1);

            // if too many continuous days of this shift
            if (countCont <= -1) return -2000;

            // check if we have necessary rest days to assign this new shift
            for (int i = newDayScheduleDate - 1 - countCont; i >= 0; i--) {

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
                        return -3000;
                    }
                    else {
                        for (Rule rule : prevWorkShift.getRules()) {
                            if (rule.getContinuousDays() > countCont) {
                                 if (rule.getRestDays() <= countRest) continue;
                                 else return -4000;
                            }
                        } return -5000;
                    }

                }

            }
        }
        return currentDayShiftAssignments.getScore();
    }

    private static int checkContinuousNewAssignment(ShiftAssignment shiftAssignment, Schedule currentSchedule, DaySchedule currentDayShiftAssignments, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        WorkerDto worker = shiftAssignment.getWorker();

        //TODO adjust additional score to match how much staff
        boolean additionalScore = false;

        for (int i = date; i >= 0; i--) {
            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsWorker(daySchedule, worker);
            if (previousShiftAssignment == null) {
                currentSchedule.addToScore(30);
                return countCont;
            }

            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    if (rule.getContinuousDays() > countCont) standingRules.add(rule);
                    //if (rule.getContinuousDays() == countCont + 1) 
                    additionalScore = true;
                }

                if (standingRules.isEmpty()) {
                    return -1;
                } else rules = standingRules;
            } else {
                currentSchedule.addToScore(20);
                return countCont;
            }
        }
        currentSchedule.addToScore(10);
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

    public static void checkDesiredVacationDays(WorkerDto worker, int date, Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        // TODO: kui palju see score täpselt muutub
        if (worker.getDesiredVacationDays().contains(date)) {
            currentDayShiftAssignments.addToScore(-10);
        }
    }

    public static void checkWorkerHours(ShiftAssignment shiftAssignment, Schedule currentSchedule, DaySchedule currentDayShiftAssignments) {
        WorkerDto worker = shiftAssignment.getWorker();
        Shift shift = shiftAssignment.getShift();
        int workerCurrentHours = currentSchedule.getWorkerHours().get(worker);

        // TODO: Adjust score impact calculation if needed
        if (workerCurrentHours - shift.getDuration() < -2) {
            int penalty = ((workerCurrentHours - shift.getDuration()) * 2);            
            currentDayShiftAssignments.addToScore(penalty);
        }
    }

    public static boolean initialValidator(Map<Shift, List<WorkerDto>> currentRequestedWorkDays, Shift shift, WorkerDto worker) {
        if (!worker.getAssignedShifts().contains(shift)) return false;
        if (currentRequestedWorkDays.containsKey(shift) && !currentRequestedWorkDays.get(shift).contains(worker)) return false;
        return true;
    }

}
