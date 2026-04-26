package com.ensa.incidentservice.repositories;

import com.ensa.incidentservice.entities.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> { }
