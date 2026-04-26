package com.incidents.chatbot_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "incident-service", url = "${incident.service.url}")
public interface IncidentClient {

    @GetMapping("/api/incidents/active")
    List<Object> getActiveIncidents();
}