package com.graafik.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.graafik.model.Entities.Employee;
import com.graafik.model.Entities.Shift;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    List<Employee> findAllByAssignedShiftsContaining(Shift shift);
}
