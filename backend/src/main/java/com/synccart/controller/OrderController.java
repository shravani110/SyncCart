package com.synccart.controller;

import com.synccart.dto.CheckoutRequest;
import com.synccart.dto.OrderDto;
import com.synccart.model.User;
import com.synccart.service.AuthService;
import com.synccart.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping("/rooms/{roomCode}/checkout")
    public ResponseEntity<?> checkout(
            @PathVariable String roomCode,
            @Valid @RequestBody CheckoutRequest request) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            OrderDto order = orderService.checkoutRoom(roomCode, request, currentUser);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/orders/{orderNumber}")
    public ResponseEntity<?> getOrder(@PathVariable String orderNumber) {
        try {
            OrderDto order = orderService.getOrderByNumber(orderNumber);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/orders/my-orders")
    public ResponseEntity<?> getMyOrders() {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            List<OrderDto> orders = orderService.getUserOrders(currentUser);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
