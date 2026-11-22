package com.synccart.service;

import com.synccart.dto.AddCartItemRequest;
import com.synccart.dto.RoomDetailsDto;
import com.synccart.dto.UpdateCartItemRequest;
import com.synccart.dto.WebSocketMessage;
import com.synccart.model.*;
import com.synccart.repository.CartItemRepository;
import com.synccart.repository.ProductRepository;
import com.synccart.repository.RoomMemberRepository;
import com.synccart.repository.ShoppingRoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ShoppingRoomRepository roomRepository;
    private final ProductRepository productRepository;
    private final RoomMemberRepository memberRepository;
    private final RoomService roomService;
    private final WebSocketNotificationService notificationService;

    public CartService(CartItemRepository cartItemRepository,
                       ShoppingRoomRepository roomRepository,
                       ProductRepository productRepository,
                       RoomMemberRepository memberRepository,
                       RoomService roomService,
                       WebSocketNotificationService notificationService) {
        this.cartItemRepository = cartItemRepository;
        this.roomRepository = roomRepository;
        this.productRepository = productRepository;
        this.memberRepository = memberRepository;
        this.roomService = roomService;
        this.notificationService = notificationService;
    }

    private void validateMembership(ShoppingRoom room, User user) {
        if (!memberRepository.existsByRoomAndUser(room, user)) {
            throw new IllegalArgumentException("User is not a member of room: " + room.getRoomCode());
        }
        if (room.getStatus() == RoomStatus.CHECKED_OUT) {
            room.setStatus(RoomStatus.ACTIVE);
            roomRepository.save(room);
        }
    }

    @Transactional
    public RoomDetailsDto addItem(String roomCode, AddCartItemRequest request, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        validateMembership(room, currentUser);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.getProductId()));

        Optional<CartItem> existingItem = cartItemRepository.findByRoomAndProduct(room, product);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setUpdatedAt(LocalDateTime.now());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(room, product, currentUser, request.getQuantity(), product.getPrice());
            cartItemRepository.save(newItem);
        }

        RoomDetailsDto updatedDetails = roomService.getRoomDetails(upperCode, currentUser);

        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.ITEM_ADDED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                currentUser.getFullName() + " added " + product.getName() + " to the cart",
                updatedDetails
        );

        return updatedDetails;
    }

    @Transactional
    public RoomDetailsDto updateQuantity(String roomCode, Long cartItemId, UpdateCartItemRequest request, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        validateMembership(room, currentUser);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));

        if (!item.getRoom().getId().equals(room.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to room " + upperCode);
        }

        // RBAC: Member can update only items they added; Host can update any item
        RoomMember currentMember = memberRepository.findByRoomAndUser(room, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("User not a member"));

        boolean isHost = currentMember.getRoomRole() == RoomRole.HOST;
        boolean isOwner = item.getAddedBy().getId().equals(currentUser.getId());

        if (!isHost && !isOwner) {
            throw new IllegalStateException("Permission denied: You can only edit items you added unless you are Host");
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(request.getQuantity());
            item.setUpdatedAt(LocalDateTime.now());
            cartItemRepository.save(item);
        }

        RoomDetailsDto updatedDetails = roomService.getRoomDetails(upperCode, currentUser);

        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.ITEM_UPDATED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                currentUser.getFullName() + " updated " + item.getProduct().getName() + " quantity to " + request.getQuantity(),
                updatedDetails
        );

        return updatedDetails;
    }

    @Transactional
    public RoomDetailsDto removeItem(String roomCode, Long cartItemId, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        validateMembership(room, currentUser);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + cartItemId));

        if (!item.getRoom().getId().equals(room.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to room " + upperCode);
        }

        // RBAC: Member can remove items they added; Host can remove any item
        RoomMember currentMember = memberRepository.findByRoomAndUser(room, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("User not a member"));

        boolean isHost = currentMember.getRoomRole() == RoomRole.HOST;
        boolean isOwner = item.getAddedBy().getId().equals(currentUser.getId());

        if (!isHost && !isOwner) {
            throw new IllegalStateException("Permission denied: You can only delete items you added unless you are Host");
        }

        String productName = item.getProduct().getName();
        cartItemRepository.delete(item);

        RoomDetailsDto updatedDetails = roomService.getRoomDetails(upperCode, currentUser);

        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.ITEM_REMOVED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                currentUser.getFullName() + " removed " + productName + " from the cart",
                updatedDetails
        );

        return updatedDetails;
    }

    @Transactional
    public RoomDetailsDto clearCart(String roomCode, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        validateMembership(room, currentUser);

        // RBAC: Host only
        RoomMember currentMember = memberRepository.findByRoomAndUser(room, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("User not a member"));

        if (currentMember.getRoomRole() != RoomRole.HOST) {
            throw new IllegalStateException("Only the Host can clear the entire cart");
        }

        cartItemRepository.deleteByRoom(room);

        RoomDetailsDto updatedDetails = roomService.getRoomDetails(upperCode, currentUser);

        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.CART_CLEARED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                currentUser.getFullName() + " cleared the room cart",
                updatedDetails
        );

        return updatedDetails;
    }
}
