package com.incidents.chatbot_service.controller;

import com.incidents.chatbot_service.model.ChatMessage;
import com.incidents.chatbot_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatRestController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatMessage> chat(@RequestBody ChatMessage request) {
        String convId = request.getConversationId() != null
                ? request.getConversationId()
                : UUID.randomUUID().toString();

        String reply = chatService.chat(request.getContent(), convId);

        return ResponseEntity.ok(ChatMessage.builder()
                .conversationId(convId)
                .role("assistant")
                .content(reply)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("chatbot-service OK - port 8084");
    }
}
