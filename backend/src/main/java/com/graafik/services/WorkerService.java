package com.graafik.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.graafik.model.Worker;
import com.graafik.repositories.WorkerRepository;

@Service
public class WorkerService {
    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public Worker saveWorker(Worker worker) {
        return workerRepository.save(worker);
    }
}
