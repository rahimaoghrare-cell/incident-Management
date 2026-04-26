package com.incidents.chatbot_service.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String conversationId;
    private String role;        // "user" ou "assistant"
    private String content;
    private LocalDateTime timestamp;
}