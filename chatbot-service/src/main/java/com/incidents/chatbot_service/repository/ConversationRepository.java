package com.incidents.chatbot_service.repository;

import com.incidents.chatbot_service.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByConversationIdOrderByTimestampAsc(String conversationId);
}
