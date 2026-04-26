package com.incidents.chatbot_service.service;

import com.incidents.chatbot_service.client.IncidentClient;
import com.incidents.chatbot_service.model.Conversation;
import com.incidents.chatbot_service.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;
    private final ConversationRepository conversationRepo;
    private final IncidentClient incidentClient;

    private static final String SYSTEM_PROMPT = """
            Tu es un assistant expert en gestion des incidents informatiques.
            Tu aides les équipes à diagnostiquer, prioriser et résoudre les incidents.
            Réponds toujours en français, de manière concise et professionnelle.
            Si on te demande les incidents en cours, utilise les données fournies.
            """;

    public String chat(String userMessage, String conversationId) {

        // Récupère contexte incidents si besoin
        String context = "";
        if (userMessage.toLowerCase().contains("incident")) {
            try {
                var incidents = incidentClient.getActiveIncidents();
                context = "\n\nIncidents actifs : " + incidents.toString();
            } catch (Exception e) {
                log.warn("Impossible de récupérer les incidents : {}", e.getMessage());
            }
        }

        String fullMessage = userMessage + context;

        // Appel Spring AI → Claude
        String reply = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(fullMessage)
                .call()
                .content();

        // Sauvegarde en base
        saveMessage(conversationId, "user", userMessage);
        saveMessage(conversationId, "assistant", reply);

        return reply;
    }

    private void saveMessage(String convId, String role, String content) {
        conversationRepo.save(Conversation.builder()
                .conversationId(convId)
                .role(role)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build());
    }
}