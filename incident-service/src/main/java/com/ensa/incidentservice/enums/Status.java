package com.ensa.incidentservice.enums;

public enum Status {
    NEW,          // Nouvel incident créé
    ASSIGNED,     // Assigné à un technicien
    IN_PROGRESS,  // En cours de résolution
    RESOLVED,     // Résolu par le technicien
    CLOSED        // Fermé définitivement
}