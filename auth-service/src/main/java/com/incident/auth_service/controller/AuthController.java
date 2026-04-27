package com.incident.auth_service.controller;

import com.incident.auth_service.dto.LoginRequest;
import com.incident.auth_service.dto.RegisterRequest;
import com.incident.auth_service.dto.TokenResponse;
import com.incident.auth_service.service.KeycloakService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final KeycloakService keycloakService;

    public AuthController(KeycloakService keycloakService) {
        this.keycloakService = keycloakService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse token = keycloakService.login(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        keycloakService.register(request);
        return ResponseEntity.ok(Map.of("message", "Utilisateur créé avec succès"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(Map.of("username", principal.getName()));
    }
}