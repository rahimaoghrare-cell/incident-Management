package com.ensa.incidentservice.entities;

import com.ensa.incidentservice.enums.Priority;
import com.ensa.incidentservice.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Incident {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    private String clientId;
    private String technicianId;
    private LocalDateTime createdAt;
    private String attachmentUrl;
}