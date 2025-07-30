package com.graafik.repositories;

import com.graafik.model.Rule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RuleRepository extends JpaRepository<Rule, UUID> {
    // Optional: add custom queries here
}
