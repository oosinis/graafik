package com.graafik.schedule;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.graafik.model.Domain.ScheduleAlg;
import com.graafik.model.Dtos.ScheduleRequest;
import com.graafik.model.Entities.DaySchedule;
import com.graafik.model.Entities.Employee;
import com.graafik.model.Entities.Rule;
import com.graafik.model.Entities.Shift;
import com.graafik.model.Entities.ShiftAssignment;


public class RuleValidator {
    
    /**
     * 
     * @param scheduleRequest 
     * @param currentSchedule the schedule that has already been checked and saved
     * @param currentDayShiftAssignments new assignments to be checked now
     * @return the score of the new assignments
     */
    public static int dayAssignmentsValidator(ScheduleRequest scheduleRequest, ScheduleAlg currentSchedule, DaySchedule currentDayShiftAssignments) {
        
        currentDayShiftAssignments.setScore(0);

        // look through assignments for a day
        for (ShiftAssignment shiftAssignment : currentDayShiftAssignments.getAssignments())  {

            Employee employee = shiftAssignment.getEmployee();

            // rest days in  row
            int countRest = 0;

            // continuous days of work before previous rest
            int countPrevWork = 0;
            // and the shift tht they were working
            Shift prevWorkShift = null;

            // date of the currently observable day
            int newDayScheduleDate = (currentSchedule.getDaySchedules() == null) ? 0 : currentSchedule.getDaySchedules().size();
            
            checkDesiredVacationDays(employee, newDayScheduleDate, currentSchedule, currentDayShiftAssignments);
            checkEmployeeMinutes(shiftAssignment, currentSchedule, currentDayShiftAssignments);

            // check how mny days in a row the current assignment is
            int countCont = checkContinuousNewAssignment(shiftAssignment, currentSchedule, currentDayShiftAssignments, newDayScheduleDate - 1);

            // if too many continuous days of this shift
            if (countCont <= -1) return -2000;

            // check if we have necessary rest days to assign this new shift
            for (int i = newDayScheduleDate - 1 - countCont; i >= 0; i--) {

                DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
                ShiftAssignment previousShiftAssignment = DaySchedule.containsEmployee(daySchedule, employee);
                
                // if the employee has nothing asigned on the previous day
                if (previousShiftAssignment == null) {
                    countRest++;
                } 
                else {
                    prevWorkShift = previousShiftAssignment.getShift();
                    countPrevWork = checkContinuous(previousShiftAssignment, currentSchedule, i);
                    if (countPrevWork == -1) {
                        return -3000;
                    }
                    else {
                        for (Rule rule : prevWorkShift.getRules()) {
                            if (rule.getContinuousDays() == countCont) {
                                 if (rule.getRestDays() <= countRest);
                                 else return -4000;
                            }
                            else if (rule.getContinuousDays() < countCont) {
                                return -5000;
                            }
                        } 
                    }

                }

            }
        }
        return currentDayShiftAssignments.getScore();
    }

    /**
     * check the continuous assignments of the new shift
     * @param shiftAssignment assignment of shift and employee
     * @param currentSchedule the schedule tht' already been checked and saved
     * @param currentDayShiftAssignments the new assignments we re currently checking, here just to chnge the score if the continuous shifts are the exact required amount
     * @param date
     * @return the nr of continuous shifts, if -1 then there are too many
     */
    private static int checkContinuousNewAssignment(ShiftAssignment shiftAssignment, ScheduleAlg currentSchedule, DaySchedule currentDayShiftAssignments, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        Employee employee = shiftAssignment.getEmployee();

        //TODO adjust additional score to match how much staff
        int additionalScore = 0;

        for (int i = date; i >= 0; i--) {
            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsEmployee(daySchedule, employee);
            if (previousShiftAssignment == null) {
                currentDayShiftAssignments.addToScore(additionalScore);
                return countCont;
            }

            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    if (rule.getContinuousDays() > countCont) standingRules.add(rule);
                    if (rule.getContinuousDays() == countCont + 1) additionalScore = 2;
                }

                if (standingRules.isEmpty()) {
                    return -1;
                } else rules = standingRules;
            } else {
                currentDayShiftAssignments.addToScore(additionalScore);
                return countCont;
            }
        }
        currentDayShiftAssignments.addToScore(additionalScore);
        return countCont; 
    }


    /**
     * check how many of the previously assigned hift in a row to know the required rest time
     * @param shiftAssignment
     * @param currentSchedule
     * @param date
     * @return
     */
    private static int checkContinuous(ShiftAssignment shiftAssignment, ScheduleAlg currentSchedule, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        Employee employee = shiftAssignment.getEmployee();

        for (int i = date; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsEmployee(daySchedule, employee);
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

    public static void checkDesiredVacationDays(Employee employee, int date, ScheduleAlg currentSchedule, DaySchedule currentDayShiftAssignments) {
        // TODO: kui palju see score täpselt muutub
        if (employee.getDesiredVacationDays().contains(date)) {
            currentDayShiftAssignments.addToScore(-10);
        }
    }

    public static void checkEmployeeMinutes(ShiftAssignment shiftAssignment, ScheduleAlg currentSchedule, DaySchedule currentDayShiftAssignments) {
        Employee employee = shiftAssignment.getEmployee();
        Shift shift = shiftAssignment.getShift();
        long employeeCurrentHours = currentSchedule.getEmployeeHoursInMinutes().get(employee.getId());

        // TODO: Adjust score impact calculation if needed
        // rn in inutes, 2h mööda on fine, peale seda võtab maha skoorist 2x nii plju kui palju tunde mööda vajalikes
        if (employeeCurrentHours - shift.getDurationInMinutes() < -120) {
            int penalty = (int) ((employeeCurrentHours - shift.getDurationInMinutes()) * 2 / 60);            
            currentDayShiftAssignments.addToScore(penalty);
        }
    }

    public static boolean initialValidator(Map<UUID, List<Employee>> currentRequestedWorkDays, Shift shift, Employee employee) {
        return employee.getAssignedShifts().contains(shift) || currentRequestedWorkDays.containsKey(shift.getId()) && !currentRequestedWorkDays.get(shift.getId()).contains(employee);
    }

    /**
     *  Validate only one shiftassignment for schedule
     *  returns different scores for different mjor mistakes for easier testing
     * @param scheduleRequest 
     * @param currentSchedule
     * @param shiftAssignment
     * @param date
     * @return score of this addition
     */
    public static int singleAssignmentValidator(ScheduleRequest scheduleRequest, ScheduleAlg currentSchedule, ShiftAssignment shiftAssignment, int date) {

        Shift shift = shiftAssignment.getShift();
        Employee employee = shiftAssignment.getEmployee();
        int score = 0;

        // rest days in  row
        int countRest = 0;

        // continuous days of work before previous rest
        int countPrevWork = 0;
        // and the shift tht they were working
        Shift prevWorkShift = null;


        // check employee hours
        long newHours = currentSchedule.getEmployeeHoursInMinutes().get(employee.getId()) - shift.getDurationInMinutes();
        if (newHours < -2) score -= newHours * 2;
        // check desired vacation
        if (employee.getDesiredVacationDays().contains(date)) score -= 10;

        int countCont = checkContinuousNewAssignmentSingleShift(shiftAssignment, currentSchedule, date);

        if (countCont <= -1) {
            return score - 2000;
        }

        for (int i = date - 1 - countCont; i >= 0; i--) {

            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsEmployee(daySchedule, employee);
            
            // if the employee has nothing asigned on the previous day
            if (previousShiftAssignment == null) {
                countRest++;
            } 
            else {
                prevWorkShift = previousShiftAssignment.getShift();
                countPrevWork = checkContinuous(previousShiftAssignment, currentSchedule, i);
                if (countPrevWork == -1) {
                    score -= 3000;
                    break;
                }
                else {
                    for (Rule rule : prevWorkShift.getRules()) {
                        if (rule.getContinuousDays() == countCont) {
                                if (rule.getRestDays() <= countRest) continue;
                                else score -= 4000;
                                break;
                        } 
                        else if (rule.getContinuousDays() < countCont) {
                            score -= 5000;
                            break;
                        }
                    }
                }
            }
        }

        return score;
    }


    // TODO make new system so all validation is through one function

    /**
     * Check continuous days and rest for only one addition
     * @param shiftAssignment
     * @param currentSchedule
     * @param date
     * @return
     */
    private static int checkContinuousNewAssignmentSingleShift(ShiftAssignment shiftAssignment, ScheduleAlg currentSchedule, int date) {
        int countCont = 0;
        List<Rule> rules = shiftAssignment.getShift().getRules();
        Employee employee = shiftAssignment.getEmployee();

        //TODO adjust additional score to match how much staff
        int additionalScore = 0;

        for (int i = date; i >= 0; i--) {
            DaySchedule daySchedule = currentSchedule.getDaySchedules().get(i);
            ShiftAssignment previousShiftAssignment = DaySchedule.containsEmployee(daySchedule, employee);
            if (previousShiftAssignment == null) {
                currentSchedule.addToScore(additionalScore);
                return countCont;
            }

            if (previousShiftAssignment.getShift() == shiftAssignment.getShift()) {
                countCont++;
                List<Rule> standingRules = new ArrayList<>();
                for (Rule rule : rules) {
                    if (rule.getContinuousDays() > countCont) standingRules.add(rule);
                    if (rule.getContinuousDays() == countCont + 1) additionalScore = 2;
                }

                if (standingRules.isEmpty()) {
                    return -1;
                } else rules = standingRules;
            } else {
                currentSchedule.addToScore(additionalScore);
                return countCont;
            }
        }
        currentSchedule.addToScore(additionalScore);
        return countCont; 
    }


}
