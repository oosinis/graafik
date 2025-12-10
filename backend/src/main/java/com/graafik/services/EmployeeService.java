package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.graafik.model.Entities.*;
import com.graafik.model.Dtos.UpdateEmployeeRequest;
import com.graafik.repositories.EmployeeRepository;
import com.graafik.repositories.RoleRepository;
import com.graafik.repositories.ShiftRepository;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ShiftRepository shiftRepository;
    private final RoleRepository roleRepository;

    public EmployeeService(EmployeeRepository employeeRepository, ShiftRepository shiftRepository,
            RoleRepository roleRepository) {
        this.employeeRepository = employeeRepository;
        this.shiftRepository = shiftRepository;
        this.roleRepository = roleRepository;
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
            if (updated.getRole() != null)
                existing.setRole(updated.getRole());
            if (updated.getAssignedShifts() != null)
                existing.setAssignedShifts(updated.getAssignedShifts());
            return employeeRepository.save(existing);
        });
    }

    public Optional<Employee> updateEmployee(UUID id, UpdateEmployeeRequest request) {
        return employeeRepository.findById(id).map(existing -> {
            if (request.getName() != null) {
                existing.setName(request.getName());
            }
            if (request.getEmail() != null) {
                existing.setEmail(request.getEmail());
            }
            if (request.getPhone() != null) {
                existing.setPhone(request.getPhone());
            }
            if (request.getEmployeeRole() != null) {
                roleRepository.findByName(request.getEmployeeRole())
                        .ifPresent(existing::setRole);
            }
            if (request.getSecondaryRole() != null) {
                if (request.getSecondaryRole().isEmpty()) {
                    existing.setSecondaryRole(null);
                } else {
                    roleRepository.findByName(request.getSecondaryRole())
                            .ifPresent(existing::setSecondaryRole);
                }
            }
            if (request.getWorkLoad() != null) {
                existing.setWorkLoad(request.getWorkLoad());
            }
            if (request.getNotes() != null) {
                existing.setNotes(request.getNotes());
            }
            if (request.getPreferredShifts() != null) {
                existing.setPreferredShifts(request.getPreferredShifts());
            }
            if (request.getPreferredWorkdays() != null) {
                existing.setPreferredWorkdays(request.getPreferredWorkdays());
            }

            // Convert shift IDs to Shift entities
            if (request.getAssignedShiftIds() != null) {
                List<Shift> shifts = request.getAssignedShiftIds().stream()
                        .map(shiftId -> shiftRepository.findById(shiftId))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());
                existing.setAssignedShifts(shifts);
            }

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
