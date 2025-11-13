package com.graafik.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.graafik.model.Entities.Rule;

public interface RuleRepository extends JpaRepository<Rule, UUID> {
        List<Rule> findByShiftId(UUID shiftId);

}
