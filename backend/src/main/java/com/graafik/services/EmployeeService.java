package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.graafik.model.Entities.*;
import com.graafik.repositories.EmployeeRepository;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee saveEmployee(Employee Employee) {
        return employeeRepository.save(Employee);
    }

    public Optional<Employee> getEmployeeById(UUID id) {
        return employeeRepository.findById(id);
    }

    public boolean deleteEmployee(UUID id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Employee> updateEmployee(UUID id, Employee updated) {
        return employeeRepository.findById(id).map(existing -> {
            if (updated.getName() != null)
                existing.setName(updated.getName());
            if (updated.getEmployeeRole() != null)
                existing.setEmployeeRole(updated.getEmployeeRole());
            if (updated.getAssignedShifts() != null)
                existing.setAssignedShifts(updated.getAssignedShifts());
            return employeeRepository.save(existing);
        });
    }

    public Optional<Employee> updateAvailability(UUID id, com.graafik.dto.AvailabilityDTO availability) {
        return employeeRepository.findById(id).map(existing -> {
            existing.setDesiredWorkDays(availability.getDesiredWorkDays());
            existing.setRequestedDaysOff(availability.getRequestedDaysOff());
            existing.setVacationDays(availability.getVacationDays());
            existing.setSickDays(availability.getSickDays());
            return employeeRepository.save(existing);
        });
    }

    public Optional<com.graafik.dto.AvailabilityDTO> getAvailability(UUID id, int year, int month) {
        return employeeRepository.findById(id).map(employee -> {
            com.graafik.dto.AvailabilityDTO dto = new com.graafik.dto.AvailabilityDTO();
            String prefix = String.format("%04d-%02d", year, month + 1); // Month is 0-indexed in request but 1-12 in
                                                                         // date string?
            // Wait, frontend sends 0-11 for month index. Date strings are YYYY-MM-DD.
            // So if frontend sends 0 (Jan), we want "2025-01".

            dto.setDesiredWorkDays(filterDates(employee.getDesiredWorkDays(), prefix));
            dto.setRequestedDaysOff(filterDates(employee.getRequestedDaysOff(), prefix));
            dto.setVacationDays(filterDates(employee.getVacationDays(), prefix));
            dto.setSickDays(filterDates(employee.getSickDays(), prefix));

            return dto;
        });
    }

    private List<String> filterDates(List<String> dates, String prefix) {
        if (dates == null)
            return List.of();
        return dates.stream()
                .filter(date -> date.startsWith(prefix))
                .collect(java.util.stream.Collectors.toList());
    }
}
