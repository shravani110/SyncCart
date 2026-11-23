package com.synccart.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class WebSocketMessage<T> {

    public enum MessageType {
        CART_UPDATED,
        ITEM_ADDED,
        ITEM_UPDATED,
        ITEM_REMOVED,
        BUDGET_UPDATED,
        MEMBER_JOINED,
        MEMBER_REMOVED,
        CART_CLEARED,
        CHECKOUT_COMPLETED,
        ERROR
    }

    private MessageType type;
    private String roomCode;
    private String senderUsername;
    private String senderFullName;
    private String message;
    private T payload;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp = LocalDateTime.now();

    public WebSocketMessage() {
    }

    public WebSocketMessage(MessageType type, String roomCode, String senderUsername, String senderFullName, String message, T payload) {
        this.type = type;
        this.roomCode = roomCode;
        this.senderUsername = senderUsername;
        this.senderFullName = senderFullName;
        this.message = message;
        this.payload = payload;
        this.timestamp = LocalDateTime.now();
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderFullName() {
        return senderFullName;
    }

    public void setSenderFullName(String senderFullName) {
        this.senderFullName = senderFullName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
