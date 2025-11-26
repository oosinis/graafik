package com.graafik.dto;

import java.util.List;

public class AvailabilityDTO {
    private List<String> desiredWorkDays;
    private List<String> requestedDaysOff;
    private List<String> vacationDays;
    private List<String> sickDays;

    public List<String> getDesiredWorkDays() {
        return desiredWorkDays;
    }

    public void setDesiredWorkDays(List<String> desiredWorkDays) {
        this.desiredWorkDays = desiredWorkDays;
    }

    public List<String> getRequestedDaysOff() {
        return requestedDaysOff;
    }

    public void setRequestedDaysOff(List<String> requestedDaysOff) {
        this.requestedDaysOff = requestedDaysOff;
    }

    public List<String> getVacationDays() {
        return vacationDays;
    }

    public void setVacationDays(List<String> vacationDays) {
        this.vacationDays = vacationDays;
    }

    public List<String> getSickDays() {
        return sickDays;
    }

    public void setSickDays(List<String> sickDays) {
        this.sickDays = sickDays;
    }
}
