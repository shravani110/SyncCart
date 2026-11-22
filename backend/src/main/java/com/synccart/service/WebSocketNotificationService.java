package com.synccart.service;

import com.synccart.dto.WebSocketMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketNotificationService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public <T> void broadcastToRoom(String roomCode, WebSocketMessage.MessageType type,
                                   String senderUsername, String senderFullName,
                                   String message, T payload) {
        String destination = "/topic/room/" + roomCode;
        WebSocketMessage<T> wsMsg = new WebSocketMessage<>(
                type,
                roomCode,
                senderUsername,
                senderFullName,
                message,
                payload
        );
        logger.info("Broadcasting to {}: [{}] {}", destination, type, message);
        messagingTemplate.convertAndSend(destination, wsMsg);
    }
}
