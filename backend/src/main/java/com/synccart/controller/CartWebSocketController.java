package com.synccart.controller;

import com.synccart.dto.AddCartItemRequest;
import com.synccart.dto.RoomDetailsDto;
import com.synccart.dto.UpdateCartItemRequest;
import com.synccart.model.User;
import com.synccart.repository.UserRepository;
import com.synccart.service.CartService;
import com.synccart.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Optional;

@Controller
public class CartWebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(CartWebSocketController.class);

    private final CartService cartService;
    private final RoomService roomService;
    private final UserRepository userRepository;

    public CartWebSocketController(CartService cartService, RoomService roomService, UserRepository userRepository) {
        this.cartService = cartService;
        this.roomService = roomService;
        this.userRepository = userRepository;
    }

    private User resolveUser(Principal principal, String usernameHeader) {
        String username = principal != null ? principal.getName() : usernameHeader;
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("User could not be identified from WebSocket message");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }

    @MessageMapping("/room/{roomCode}/sync")
    public void syncRoom(
            @DestinationVariable String roomCode,
            Principal principal,
            @Header(value = "username", required = false) String usernameHeader) {
        try {
            User user = resolveUser(principal, usernameHeader);
            roomService.getRoomDetails(roomCode, user);
            logger.info("Room sync requested for {} by {}", roomCode, user.getUsername());
        } catch (Exception e) {
            logger.error("Error syncing room via WebSocket: {}", e.getMessage());
        }
    }

    @MessageMapping("/room/{roomCode}/addItem")
    public void addItemViaWs(
            @DestinationVariable String roomCode,
            @Payload AddCartItemRequest request,
            Principal principal,
            @Header(value = "username", required = false) String usernameHeader) {
        try {
            User user = resolveUser(principal, usernameHeader);
            cartService.addItem(roomCode, request, user);
        } catch (Exception e) {
            logger.error("Error adding item via WebSocket: {}", e.getMessage());
        }
    }

    @MessageMapping("/room/{roomCode}/updateQuantity/{cartItemId}")
    public void updateQuantityViaWs(
            @DestinationVariable String roomCode,
            @DestinationVariable Long cartItemId,
            @Payload UpdateCartItemRequest request,
            Principal principal,
            @Header(value = "username", required = false) String usernameHeader) {
        try {
            User user = resolveUser(principal, usernameHeader);
            cartService.updateQuantity(roomCode, cartItemId, request, user);
        } catch (Exception e) {
            logger.error("Error updating quantity via WebSocket: {}", e.getMessage());
        }
    }

    @MessageMapping("/room/{roomCode}/removeItem/{cartItemId}")
    public void removeItemViaWs(
            @DestinationVariable String roomCode,
            @DestinationVariable Long cartItemId,
            Principal principal,
            @Header(value = "username", required = false) String usernameHeader) {
        try {
            User user = resolveUser(principal, usernameHeader);
            cartService.removeItem(roomCode, cartItemId, user);
        } catch (Exception e) {
            logger.error("Error removing item via WebSocket: {}", e.getMessage());
        }
    }
}
