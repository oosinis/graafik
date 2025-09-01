package com.graafik.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.graafik.model.Worker;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, UUID> {
}
