package com.synccart.service;

import com.synccart.dto.CheckoutRequest;
import com.synccart.dto.MemberContributionDto;
import com.synccart.dto.OrderDto;
import com.synccart.dto.WebSocketMessage;
import com.synccart.model.*;
import com.synccart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShoppingRoomRepository roomRepository;
    private final RoomMemberRepository memberRepository;
    private final CartItemRepository cartItemRepository;
    private final WebSocketNotificationService notificationService;
    private static final SecureRandom RANDOM = new SecureRandom();

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ShoppingRoomRepository roomRepository,
                        RoomMemberRepository memberRepository,
                        CartItemRepository cartItemRepository,
                        WebSocketNotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.roomRepository = roomRepository;
        this.memberRepository = memberRepository;
        this.cartItemRepository = cartItemRepository;
        this.notificationService = notificationService;
    }

    private String generateOrderNumber() {
        return "SYNC-" + (100000 + RANDOM.nextInt(900000));
    }

    @Transactional
    public OrderDto checkoutRoom(String roomCode, CheckoutRequest request, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        // Check if room is already checked out
        if (room.getStatus() == RoomStatus.CHECKED_OUT) {
            throw new IllegalStateException("Room has already completed checkout");
        }

        // RBAC: Only Host can checkout!
        RoomMember member = memberRepository.findByRoomAndUser(room, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of room"));

        if (member.getRoomRole() != RoomRole.HOST) {
            throw new IllegalStateException("Only the Host can finalize checkout and place the order");
        }

        List<CartItem> cartItems = cartItemRepository.findByRoomOrderByUpdatedAtDesc(room);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot checkout an empty cart");
        }

        // Calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem ci : cartItems) {
            totalAmount = totalAmount.add(ci.getSubtotal());
        }

        Order order = new Order(
                generateOrderNumber(),
                room.getRoomCode(),
                currentUser,
                totalAmount,
                request.getPaymentMethod(),
                request.getShippingAddress()
        );
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem(
                    savedOrder,
                    ci.getProduct(),
                    ci.getAddedBy(),
                    ci.getProduct().getName(),
                    ci.getUnitPrice(),
                    ci.getQuantity(),
                    ci.getSubtotal()
            );
            orderItems.add(orderItemRepository.save(oi));
        }
        savedOrder.setItems(orderItems);

        // Mark room status as CHECKED_OUT
        room.setStatus(RoomStatus.CHECKED_OUT);
        roomRepository.save(room);

        // Clear cart items
        cartItemRepository.deleteByRoom(room);

        OrderDto orderDto = mapToOrderDto(savedOrder, room);

        // Broadcast to all room members
        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.CHECKOUT_COMPLETED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                "Checkout successfully finalized by Host " + currentUser.getFullName() + "! Order #" + savedOrder.getOrderNumber(),
                orderDto
        );

        return orderDto;
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));
        return mapToOrderDto(order, null);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(User user) {
        List<Order> orders = orderRepository.findByHostOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(o -> mapToOrderDto(o, null))
                .collect(Collectors.toList());
    }

    private OrderDto mapToOrderDto(Order order, ShoppingRoom optionalRoom) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setRoomCode(order.getRoomCode());
        dto.setHostId(order.getHost().getId());
        dto.setHostUsername(order.getHost().getUsername());
        dto.setHostFullName(order.getHost().getFullName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());

        List<OrderDto.OrderItemDto> itemDtos = new ArrayList<>();
        Map<String, BigDecimal> memberContributions = new HashMap<>();
        Map<String, String> memberFullNames = new HashMap<>();
        Map<String, Integer> memberCounts = new HashMap<>();

        for (OrderItem oi : order.getItems()) {
            itemDtos.add(new OrderDto.OrderItemDto(
                    oi.getId(),
                    oi.getProduct() != null ? oi.getProduct().getId() : null,
                    oi.getProductName(),
                    oi.getUnitPrice(),
                    oi.getQuantity(),
                    oi.getSubtotal(),
                    oi.getAddedByUser() != null ? oi.getAddedByUser().getUsername() : "Guest",
                    oi.getAddedByUser() != null ? oi.getAddedByUser().getFullName() : "Guest"
            ));

            String username = oi.getAddedByUser() != null ? oi.getAddedByUser().getUsername() : "Guest";
            String fullName = oi.getAddedByUser() != null ? oi.getAddedByUser().getFullName() : "Guest";
            memberContributions.put(username, memberContributions.getOrDefault(username, BigDecimal.ZERO).add(oi.getSubtotal()));
            memberFullNames.put(username, fullName);
            memberCounts.put(username, memberCounts.getOrDefault(username, 0) + oi.getQuantity());
        }
        dto.setItems(itemDtos);

        BigDecimal total = order.getTotalAmount();
        List<MemberContributionDto> contributions = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : memberContributions.entrySet()) {
            String uname = entry.getKey();
            BigDecimal amount = entry.getValue();
            double pct = total.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(total, 4, RoundingMode.HALF_UP).doubleValue() * 100.0
                    : 0.0;
            contributions.add(new MemberContributionDto(
                    null,
                    uname,
                    memberFullNames.get(uname),
                    null,
                    memberCounts.get(uname),
                    amount,
                    Math.round(pct * 10.0) / 10.0
            ));
        }
        dto.setContributions(contributions);

        return dto;
    }
}
