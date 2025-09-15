package com.graafik.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.graafik.services.*;
import com.graafik.model.Schedule;
import com.graafik.model.Worker;


@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable UUID id) {
        Optional<Worker> worker = workerService.getWorkerById(id);
        // kui seda pole olemas siis 404
        // TODO mis frontis saab
        if (worker.isEmpty()) ResponseEntity.notFound().build();
        return ResponseEntity.ok(worker.get());
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }

    @PostMapping
    public Worker createWorker(@RequestBody Worker worker) {
        return workerService.saveWorker(worker);
    }
}

