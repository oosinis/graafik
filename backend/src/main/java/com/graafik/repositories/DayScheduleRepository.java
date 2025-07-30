package com.graafik.repositories;
import com.graafik.model.DaySchedule;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DayScheduleRepository extends JpaRepository<DaySchedule, UUID> {
    // Add custom query methods if needed
}