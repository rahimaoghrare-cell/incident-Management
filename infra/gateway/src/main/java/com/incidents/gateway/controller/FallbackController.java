package com.incidents.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/incident")
    public ResponseEntity<Map<String,String>> incidentFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", "Service Incident indisponible."));
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String,String>> userFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", "Service Utilisateur indisponible."));
    }

    @GetMapping("/chat")
    public ResponseEntity<Map<String,String>> chatFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", "Service Chat indisponible."));
    }
}
