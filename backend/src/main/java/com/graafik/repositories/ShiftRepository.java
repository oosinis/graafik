package com.graafik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

import com.graafik.dto.ShiftDTO;

@Repository
public interface ShiftRepository extends JpaRepository<ShiftDTO, UUID> {
}
