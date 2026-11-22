package com.synccart.controller;

import com.synccart.dto.AddCartItemRequest;
import com.synccart.dto.RoomDetailsDto;
import com.synccart.dto.UpdateCartItemRequest;
import com.synccart.model.User;
import com.synccart.service.AuthService;
import com.synccart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rooms/{roomCode}/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<?> addItem(
            @PathVariable String roomCode,
            @Valid @RequestBody AddCartItemRequest request) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto updatedRoom = cartService.addItem(roomCode, request, currentUser);
            return ResponseEntity.ok(updatedRoom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{cartItemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable String roomCode,
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto updatedRoom = cartService.updateQuantity(roomCode, cartItemId, request, currentUser);
            return ResponseEntity.ok(updatedRoom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeItem(
            @PathVariable String roomCode,
            @PathVariable Long cartItemId) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto updatedRoom = cartService.removeItem(roomCode, cartItemId, currentUser);
            return ResponseEntity.ok(updatedRoom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@PathVariable String roomCode) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto updatedRoom = cartService.clearCart(roomCode, currentUser);
            return ResponseEntity.ok(updatedRoom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
