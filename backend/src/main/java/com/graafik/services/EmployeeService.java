package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.graafik.model.Entities.*;
import com.graafik.model.Dtos.UpdateEmployeeRequest;
import com.graafik.repositories.EmployeeRepository;
import com.graafik.repositories.ShiftRepository;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ShiftRepository shiftRepository;

    public EmployeeService(EmployeeRepository employeeRepository, ShiftRepository shiftRepository) {
        this.employeeRepository = employeeRepository;
        this.shiftRepository = shiftRepository;
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
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getEmployeeRole() != null) existing.setEmployeeRole(updated.getEmployeeRole());
            if (updated.getAssignedShifts() != null) existing.setAssignedShifts(updated.getAssignedShifts());
            return employeeRepository.save(existing);
        });
    }

    public Optional<Employee> updateEmployee(UUID id, UpdateEmployeeRequest request) {
        return employeeRepository.findById(id).map(existing -> {
            if (request.getName() != null) {
                existing.setName(request.getName());
            }
            if (request.getEmployeeRole() != null) {
                existing.setEmployeeRole(request.getEmployeeRole());
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
}
