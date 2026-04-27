package com.ensa.commentservice.services;

import com.ensa.commentservice.clients.IncidentClient;
import com.ensa.commentservice.entities.Comment;
import com.ensa.commentservice.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CommentService {
    @Autowired private CommentRepository repository;
    @Autowired private IncidentClient incidentClient;

    public Comment save(Comment c) {
        // Appel au premier microservice via Feign
        incidentClient.checkIncident(c.getIncidentId());
        c.setCreatedAt(LocalDateTime.now());
        return repository.save(c);
    }
}