package com.incidents.chatbot_service.controller;

import com.incidents.chatbot_service.model.ChatMessage;
import com.incidents.chatbot_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void handleMessage(ChatMessage message) {
        String convId = message.getConversationId() != null
                ? message.getConversationId()
                : UUID.randomUUID().toString();

        String reply = chatService.chat(message.getContent(), convId);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + convId,
                ChatMessage.builder()
                        .conversationId(convId)
                        .role("assistant")
                        .content(reply)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}