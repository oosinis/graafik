package com.graafik.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    public Optional<Worker> getWorkerById(UUID id) {
        return workerRepository.findById(id);
    }

    public boolean deleteWorker(UUID id) {
        if (workerRepository.existsById(id)) {
            workerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
