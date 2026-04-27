package com.ensa.incidentservice.services;

import com.ensa.incidentservice.entities.Incident;
import com.ensa.incidentservice.enums.Status;
import com.ensa.incidentservice.repositories.IncidentRepository;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    public Incident createIncident(Incident incident) {
        incident.setStatus(Status.NEW); // Par défaut, un incident est "Nouveau"
        incident.setCreatedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident introuvable avec l'ID : " + id));
    }

    public Incident updateStatus(Long id, Status newStatus) {
        Incident incident = getIncidentById(id);
        incident.setStatus(newStatus);
        return incidentRepository.save(incident);
    }
    private MinioClient minioClient;

    public String uploadFile(MultipartFile file) throws Exception {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("incidents-bucket") // Le nom du bucket dans MinIO
                        .object(fileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );
        return fileName; // On retourne le nom du fichier pour le stocker dans la DB
    }
}