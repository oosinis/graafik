package com.graafik.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.graafik.model.Rule;

public interface RuleRepository extends JpaRepository<Rule, UUID> {
}
