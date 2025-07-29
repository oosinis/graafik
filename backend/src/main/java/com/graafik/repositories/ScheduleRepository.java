package com.graafik.repositories;
import com.graafik.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    // You can define custom queries here if needed, e.g.
    // Optional<Schedule> findByName(String name);
    
}