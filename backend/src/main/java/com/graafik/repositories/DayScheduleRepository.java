package com.graafik.repositories;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.graafik.model.DaySchedule;


@Repository
public interface DayScheduleRepository extends JpaRepository<DaySchedule, UUID> {
}