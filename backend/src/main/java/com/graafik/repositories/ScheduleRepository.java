package com.graafik.repositories;
import com.graafik.model.Schedule;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    // You can define custom queries here if needed, e.g.
    // Optional<Schedule> findByName(String name);
    
}