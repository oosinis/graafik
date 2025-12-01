package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.graafik.model.Entities.Employee;
import com.graafik.model.Entities.Role;
import com.graafik.repositories.EmployeeRepository;
import com.graafik.repositories.RoleRepository;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final EmployeeRepository employeeRepository;

    public RoleService(RoleRepository roleRepository, EmployeeRepository employeeRepository) {
        this.roleRepository = roleRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(UUID id) {
        return roleRepository.findById(id);
    }

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public Optional<Role> updateRole(UUID id, Role updated) {
        return roleRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setColor(updated.getColor());
            existing.setBackgroundColor(updated.getBackgroundColor());
            return roleRepository.save(existing);
        });
    }

    public boolean deleteRole(UUID id) {
        if (roleRepository.existsById(id)) {
            // Find all employees with this role and set their role to null
            List<Employee> employees = employeeRepository.findAll();
            for (Employee employee : employees) {
                if (employee.getRole() != null && employee.getRole().getId().equals(id)) {
                    employee.setRole(null);
                    employeeRepository.save(employee);
                }
                // Also check secondary role
                if (employee.getSecondaryRole() != null && employee.getSecondaryRole().getId().equals(id)) {
                    employee.setSecondaryRole(null);
                    employeeRepository.save(employee);
                }
            }
            
            roleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
