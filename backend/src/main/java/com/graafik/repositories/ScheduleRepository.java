package com.graafik.repositories;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.graafik.model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    List<Schedule> findByMonthAndYearOrderByCreatedAtDesc(int month, int year);
    Optional<Schedule> findFirstByMonthAndYearOrderByCreatedAtDesc(int month, int year);
}