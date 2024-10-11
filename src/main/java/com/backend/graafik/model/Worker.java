package com.backend.graafik.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Worker {

    int employeeId;
    String name;
    int workLoadHours;
    double workLoad;
    Integer hoursBalance;
    Integer lastMonthBalance;
    int lastMonthLastDayHours;
    List<Integer> vacationDays = new ArrayList<>();
    List<Integer> desiredVacationDays = new ArrayList<>();
    HashMap<Integer, Shift> desiredWorkDays = new HashMap<>();
    List<Integer> sickLeaveDays = new ArrayList<>();
    List<Integer> trainingDays = new ArrayList<>();
    int numOf24hShifts;

    public Worker(int employeeId, String name, int workLoadHours, double workLoad, Integer hoursBalance, int lastMonthLastDayHours, List<Integer> vacationDays, List<Integer> desiredVacationDays, HashMap<Integer, Shift> desiredWorkDays, List<Integer> sickLeaveDays, List<Integer> trainingDays) {
        this.employeeId = employeeId;
        this.name = name;
        this.workLoadHours = workLoadHours;
        this.workLoad = workLoad;
        this.hoursBalance = hoursBalance;
        this.lastMonthBalance = hoursBalance;
        this.lastMonthLastDayHours = lastMonthLastDayHours;
        this.vacationDays = vacationDays;
        this.desiredVacationDays = desiredVacationDays;
        this.desiredWorkDays = desiredWorkDays;
        this.sickLeaveDays = sickLeaveDays;
        this.trainingDays = trainingDays;

        if (workLoad == 1.0) this.numOf24hShifts = 6;
        else this.numOf24hShifts = 4;

    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getWorkLoadHours() {
        return workLoadHours;
    }

    public void setWorkLoadHours(int workLoadHours) {
        this.workLoadHours = workLoadHours;
    }

    public double getWorkLoad() {
        return workLoad;
    }

    public void setWorkLoad(double workLoad) {
        this.workLoad = workLoad;
    }

    public Integer getHoursBalance() {
        return hoursBalance;
    }

    public void setHoursBalance(Integer hoursBalance) {
        this.hoursBalance = hoursBalance;
    }

    public Integer getLastMonthBalance() {
        return lastMonthBalance;
    }

    public void setLastMonthBalance(Integer lastMonthBalance) {
        this.lastMonthBalance = lastMonthBalance;
    }

    public int getLastMonthLastDayHours() {
        return lastMonthLastDayHours;
    }

    public void setLastMonthLastDayHours(int lastMonthLastDayHours) {
        this.lastMonthLastDayHours = lastMonthLastDayHours;
    }

    public List<Integer> getVacationDays() {
        return vacationDays;
    }

    public void setVacationDays(List<Integer> vacationDays) {
        this.vacationDays = vacationDays;
    }

    public List<Integer> getDesiredVacationDays() {
        return desiredVacationDays;
    }

    public void setDesiredVacationDays(List<Integer> desiredVacationDays) {
        this.desiredVacationDays = desiredVacationDays;
    }

    public HashMap<Integer, Shift> getDesiredWorkDays() {
        return desiredWorkDays;
    }

    public void setDesiredWorkDays(HashMap<Integer, Shift> desiredWorkDays) {
        this.desiredWorkDays = desiredWorkDays;
    }

    public List<Integer> getSickLeaveDays() {
        return sickLeaveDays;
    }

    public void setSickLeaveDays(List<Integer> sickLeaveDays) {
        this.sickLeaveDays = sickLeaveDays;
    }

    public List<Integer> getTrainingDays() {
        return trainingDays;
    }

    public void setTrainingDays(List<Integer> trainingDays) {
        this.trainingDays = trainingDays;
    }

    public double getPercentageWorked() {
        return workLoadHours + hoursBalance;
    }

    public int getNumOf24hShifts() {
        return numOf24hShifts;
    }

    public void setNumOf24hShifts(int numOf24hShifts) {
        this.numOf24hShifts = numOf24hShifts;
    }

    @Override
    public String toString() {
        return "Töötaja{" +
                "nimi='" + name + '\'' +
                '}';
    }
}