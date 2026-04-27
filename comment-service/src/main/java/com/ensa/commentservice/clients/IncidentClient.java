package com.ensa.commentservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "incident-service")
public interface IncidentClient {
    @GetMapping("/api/incidents/{id}")
    Object checkIncident(@PathVariable Long id);
}