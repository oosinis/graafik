package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.graafik.model.DaySchedule;
import com.graafik.model.Schedule;
import com.graafik.model.ScheduleRequest;
import com.graafik.model.Shift;
import com.graafik.model.ShiftAssignment;
import com.graafik.model.Worker;
import com.graafik.repositories.ScheduleRepository;
import com.graafik.repositories.ShiftRepository;
import com.graafik.repositories.WorkerRepository;
import com.graafik.schedule.GenerateSchedule;
import com.graafik.schedule.RegenerateExistingSchedule;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ShiftRepository shiftRepository;
    private final WorkerRepository workerRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, ShiftRepository shiftRepository, WorkerRepository workerRepository) {
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.workerRepository = workerRepository;
    }

    @Transactional
    public Schedule createSchedule(ScheduleRequest request) {
        List<Shift> managedShifts = request.getShifts().stream()
                .map(shiftRepository::save)
                .toList();
        request.setShifts(managedShifts);

        List<Worker> managedWorkers = request.getWorkers().stream()
                .map(workerRepository::save)
                .toList();
        request.setWorkers(managedWorkers);

        List<Schedule> schedules = GenerateSchedule.generateSchedule(request);
        if (schedules.isEmpty()) return null;

        Schedule schedule = schedules.get(0);

        List<DaySchedule> daySchedules = schedule.getDaySchedules();

        for (DaySchedule daySchedule : daySchedules) {
            daySchedule.setSchedule(schedule);

            for (ShiftAssignment assignment : daySchedule.getAssignments()) {
                UUID shiftId = assignment.getShift().getId();
                Shift managedShift = managedShifts.stream()
                        .filter(s -> s.getId().equals(shiftId))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Shift not found"));
                assignment.setShift(managedShift);

                UUID workerId = assignment.getWorker().getId();
                Worker managedWorker = managedWorkers.stream()
                        .filter(w -> w.getId().equals(workerId))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Worker not found"));
                assignment.setWorker(managedWorker);
            }
        }

        schedule.setDaySchedules(daySchedules);

        return scheduleRepository.save(schedule);
    }


    @Transactional(readOnly = true)
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Schedule> getScheduleById(UUID id) {
        return scheduleRepository.findById(id);
    }

    // rn saves the new schedule by default
    // should display multiple schedules to the user save the one they choose
    public Optional<Schedule> updateSchedule(ScheduleRequest scheduleRequest, Schedule currentSchedule, int startDate, int endDate, Worker missingWorker) {
        List<Schedule> schedules = RegenerateExistingSchedule.regenerateSchedule(scheduleRequest, currentSchedule, startDate, endDate, missingWorker);
        if (schedules == null || schedules.isEmpty()) return Optional.empty();
        Schedule saved = scheduleRepository.save(schedules.get(0));
        return Optional.of(saved);
    }

    public boolean deleteSchedule(UUID id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
