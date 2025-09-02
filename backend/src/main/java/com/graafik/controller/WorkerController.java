package com.graafik.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.graafik.services.*;
import com.graafik.model.Worker;


@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
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

