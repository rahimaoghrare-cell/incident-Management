package com.ensa.incidentservice.controllers;

import com.ensa.incidentservice.entities.Incident;
import com.ensa.incidentservice.repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    @Autowired private IncidentRepository repository;

    @PostMapping
    public Incident save(@RequestBody Incident i) {
        i.setCreatedAt(LocalDateTime.now());
        return repository.save(i);
    }

    @GetMapping("/{id}")
    public Incident getOne(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @GetMapping
    public List<Incident> getAll() {
        return repository.findAll();
    }
}
