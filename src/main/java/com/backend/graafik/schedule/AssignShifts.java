package com.backend.graafik.schedule;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import com.backend.graafik.model.RecordedShift;
import com.backend.graafik.model.Shift;
import com.backend.graafik.model.Worker;


public class AssignShifts {

    // Fill in rest of the shifts
    public static void fillShifts(Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, List<Worker> workers, List<RecordedShift> recordedShifts, RecordedShift lastRecordedShift, AtomicBoolean previousStepBacktrack) {
        int daysInMonth = scheduleMatrix.length;
        for (int dayIndex = lastRecordedShift.getShiftDate(); dayIndex < daysInMonth; dayIndex++) {
            List<Shift> todayShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex);
            List<Shift> tomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 1);
            List<Shift> dayAfterTomorrowShifts = HelperMethods.getShiftsForDay(scheduleMatrix, dayIndex + 2);

            // Assign Intensiiv shift
            Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
            Shift intensiivShiftLastDayOfMonth = new Shift(16, Shift.INTENSIIV);

            if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftLastDayOfMonth)) {
                assignShiftForDay(scheduleMatrix, scheduleMatrixOriginal, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, intensiivShift,
                        workers, recordedShifts, lastRecordedShift, previousStepBacktrack);
            }
            if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftLastDayOfMonth)) {
                EnforceShifts.assignShiftToWorkerWithD(scheduleMatrix, scheduleMatrixOriginal, dayIndex, todayShifts, tomorrowShifts,
                        dayAfterTomorrowShifts, intensiivShift, workers, recordedShifts, lastRecordedShift, previousStepBacktrack);
            }
            
            // if shift still not there, backtrack
            if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftLastDayOfMonth)) {

                if (!recordedShifts.isEmpty()) {
                    HelperMethods.backtrack(recordedShifts, lastRecordedShift, previousStepBacktrack, scheduleMatrix, scheduleMatrixOriginal, workers);
                }


            }

            // Assign Osakonna Shift
            Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
            Shift osakonnaShiftLastDayOfMonth = new Shift(16, Shift.OSAKOND);

            if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftLastDayOfMonth)) {
                assignShiftForDay(scheduleMatrix, scheduleMatrixOriginal, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, osakonnaShift,
                        workers, recordedShifts, lastRecordedShift, previousStepBacktrack);
            }

            if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftLastDayOfMonth)) {
                EnforceShifts.assignShiftToWorkerWithD(scheduleMatrix, scheduleMatrixOriginal, dayIndex, todayShifts, tomorrowShifts,
                        dayAfterTomorrowShifts, osakonnaShift, workers, recordedShifts, lastRecordedShift, previousStepBacktrack);
            }

            // if shift still not there, backtrack
            if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftLastDayOfMonth)) {

                if (!recordedShifts.isEmpty()) {
                    HelperMethods.backtrack(recordedShifts, lastRecordedShift, previousStepBacktrack, scheduleMatrix, scheduleMatrixOriginal, workers);           
                }              
            }
            
            // Assign Short shift
            Shift lühikeShift = new Shift(8, Shift.OSAKOND);
            if (!todayShifts.contains(lühikeShift)) {
                assignShiftForDay(scheduleMatrix, scheduleMatrixOriginal, dayIndex, todayShifts, tomorrowShifts, dayAfterTomorrowShifts, lühikeShift,
                        workers, recordedShifts, lastRecordedShift, previousStepBacktrack);
            }
            if (!todayShifts.contains(lühikeShift)) {
                EnforceShifts.assignShiftToWorkerWithD(scheduleMatrix, scheduleMatrixOriginal, dayIndex, todayShifts, tomorrowShifts,
                        dayAfterTomorrowShifts, lühikeShift, workers, recordedShifts, lastRecordedShift, previousStepBacktrack);
            }

            // if shift still not there, backtrack
            if (!todayShifts.contains(lühikeShift)) {

                if (!recordedShifts.isEmpty()) {
                    HelperMethods.backtrack(recordedShifts, lastRecordedShift, previousStepBacktrack, scheduleMatrix, scheduleMatrixOriginal, workers);
                }

            }

            PrintMissingShifts(todayShifts, dayIndex);
        }
    }

    

    // Assign needed shifts for the day
    public static void assignShiftForDay(Shift[][] scheduleMatrix, Shift[][] scheduleMatrixOriginal, int dayIndex, List<Shift> todayShifts,
                                         List<Shift> tomorrowShifts, List<Shift> dayAfterTomorrowShifts, Shift shift, List<Worker> workers, List<RecordedShift> recordedShifts, RecordedShift lastRecordedShift, AtomicBoolean previousStepBacktrack) {
        
        
        List<Worker> unusedWorkers;
        if (previousStepBacktrack.get()) {
            unusedWorkers = workers.subList(lastRecordedShift.getWorkerId() + 1, workers.size());

            if (unusedWorkers.isEmpty()) {
                HelperMethods.backtrack(recordedShifts, lastRecordedShift, previousStepBacktrack, scheduleMatrix, scheduleMatrixOriginal, workers);
            }
        }
        else unusedWorkers = workers;

        List<Worker> sortedWorkers = new ArrayList<>(unusedWorkers);
        sortedWorkers.sort(Comparator.comparingDouble(Worker::getPercentageWorked));

        for (Worker worker : sortedWorkers) {
            Shift todayShift = todayShifts.get(worker.getEmployeeId()); // that worker's shift today
            Shift tomorrowShift = tomorrowShifts.isEmpty() ? new Shift(0, "") : tomorrowShifts.get(worker.getEmployeeId());
            Shift dayAfterTomorrowShift = dayAfterTomorrowShifts.isEmpty() ? new Shift(0, "")
                    : dayAfterTomorrowShifts.get(worker.getEmployeeId());

            if (isValidShift(scheduleMatrix, dayIndex, todayShift, tomorrowShift, dayAfterTomorrowShift, shift, worker)) {
                if (shift.getDuration() == 24) {
                    AssignWorkerWishes.assignSpecificShifts(Arrays.asList(dayIndex + 2, dayIndex + 3), scheduleMatrix,
                            worker.getEmployeeId(),
                            new Shift(0, Shift.KEELATUD));
                    if (dayIndex == scheduleMatrix.length - 1) shift = new Shift(16, shift.getCategory());
                    worker.setNumOf24hShifts(worker.getNumOf24hShifts() - 1);


                }

                recordedShifts.add(new RecordedShift(dayIndex, worker.getEmployeeId(), recordedShifts.isEmpty() ? 0 : recordedShifts.get(recordedShifts.size() - 1).getScheduleScore()));
                previousStepBacktrack.set(false);

                scheduleMatrix[dayIndex][worker.getEmployeeId()] = shift;
                worker.setHoursBalance(worker.getHoursBalance() + shift.getDuration());

                break;
            }

        }
    }

    // Check if assigning a Shift is possible
    public static boolean isValidShift(Shift[][] scheduleMatrix, int dayIndex, Shift todayShift, Shift tomorrowShift, Shift dayAfterTomorrowShift, Shift shift, Worker worker) {
        if (!HelperMethods.atLeastTwoRestdays(scheduleMatrix, dayIndex, worker.getEmployeeId())|| !HelperMethods.atMostXDaysInARow(scheduleMatrix, dayIndex, worker.getEmployeeId(), 2)) return false;
        if (shift.getDuration() == 24) {
            return todayShift.getCategory().equals(Shift.TÜHI) && (tomorrowShift.getCategory().equals(Shift.TÜHI) || tomorrowShift.getCategory().equals(Shift.SOOVI_PUHKUS))
                    && dayAfterTomorrowShift.getDuration() == 0 && worker.getHoursBalance() + worker.getLastMonthBalance() <= -24 && worker.getNumOf24hShifts() != 0 && (dayIndex == 0 || scheduleMatrix[dayIndex - 1][worker.getEmployeeId()].getDuration() == 0);
        }
        if (shift.getDuration() == 8) {
            return todayShift.getCategory().equals(Shift.TÜHI) && tomorrowShift.getDuration() != 16 && tomorrowShift.getDuration() != 24 && worker.getHoursBalance() + worker.getLastMonthBalance() <= -2;
        }
        return false;
    }

    public static void PrintMissingShifts(List<Shift> todayShifts, int dayIndex) {
        Shift intensiivShift = new Shift(24, Shift.INTENSIIV);
        Shift intensiivShiftLastDayOfMonth = new Shift(16, Shift.INTENSIIV);
        Shift osakonnaShift = new Shift(24, Shift.OSAKOND);
        Shift osakonnaShiftLastDayOfMonth = new Shift(16, Shift.OSAKOND);
        Shift lühikeShift = new Shift(8, Shift.OSAKOND);
        if (!todayShifts.contains(lühikeShift)) System.out.println("Kuupäeval " + dayIndex + " puudu lühike vahetus");
        if (!todayShifts.contains(osakonnaShift) && !todayShifts.contains(osakonnaShiftLastDayOfMonth)) System.out.println("Kuupäeval " + dayIndex + " puudu osakonna vahetus");
        if (!todayShifts.contains(intensiivShift) && !todayShifts.contains(intensiivShiftLastDayOfMonth)) System.out.println("Kuupäeval " + dayIndex + " puudu intensiiv vahetus");
    }

}