package com.synccart.service;

import com.synccart.dto.*;
import com.synccart.model.*;
import com.synccart.repository.CartItemRepository;
import com.synccart.repository.RoomMemberRepository;
import com.synccart.repository.ShoppingRoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final ShoppingRoomRepository roomRepository;
    private final RoomMemberRepository memberRepository;
    private final CartItemRepository cartItemRepository;
    private final WebSocketNotificationService notificationService;
    private static final String ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public RoomService(ShoppingRoomRepository roomRepository,
                       RoomMemberRepository memberRepository,
                       CartItemRepository cartItemRepository,
                       WebSocketNotificationService notificationService) {
        this.roomRepository = roomRepository;
        this.memberRepository = memberRepository;
        this.cartItemRepository = cartItemRepository;
        this.notificationService = notificationService;
    }

    private String generateUniqueRoomCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
            }
            code = sb.toString();
        } while (roomRepository.existsByRoomCode(code));
        return code;
    }

    @Transactional
    public RoomDetailsDto createRoom(CreateRoomRequest request, User host) {
        if (request.getBudgetLimit() == null || request.getBudgetLimit().compareTo(new BigDecimal("500.00")) < 0) {
            throw new IllegalArgumentException("Minimum budget limit is 500");
        }
        String roomCode = generateUniqueRoomCode();
        ShoppingRoom room = new ShoppingRoom(roomCode, request.getName(), request.getBudgetLimit(), host);
        ShoppingRoom savedRoom = roomRepository.save(room);

        RoomMember hostMember = new RoomMember(savedRoom, host, RoomRole.HOST);
        memberRepository.save(hostMember);

        return getRoomDetails(savedRoom.getRoomCode(), host);
    }

    @Transactional
    public RoomDetailsDto joinRoom(String roomCode, User user) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Shopping room not found with code: " + upperCode));

        if (room.getStatus() == RoomStatus.CHECKED_OUT) {
            room.setStatus(RoomStatus.ACTIVE);
            roomRepository.save(room);
        }

        Optional<RoomMember> existing = memberRepository.findByRoomAndUser(room, user);
        if (existing.isEmpty()) {
            RoomMember newMember = new RoomMember(room, user, RoomRole.MEMBER);
            memberRepository.save(newMember);

            RoomDetailsDto updatedDetails = getRoomDetails(upperCode, user);
            notificationService.broadcastToRoom(
                    upperCode,
                    WebSocketMessage.MessageType.MEMBER_JOINED,
                    user.getUsername(),
                    user.getFullName(),
                    user.getFullName() + " joined the room!",
                    updatedDetails
            );
            return updatedDetails;
        }

        return getRoomDetails(upperCode, user);
    }

    @Transactional(readOnly = true)
    public RoomDetailsDto getRoomDetails(String roomCode, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Shopping room not found: " + upperCode));

        List<RoomMember> members = memberRepository.findByRoom(room);
        List<CartItem> cartItems = cartItemRepository.findByRoomOrderByUpdatedAtDesc(room);

        RoomDetailsDto dto = new RoomDetailsDto();
        dto.setId(room.getId());
        dto.setRoomCode(room.getRoomCode());
        dto.setName(room.getName());
        dto.setBudgetLimit(room.getBudgetLimit());
        dto.setHostId(room.getHost().getId());
        dto.setHostUsername(room.getHost().getUsername());
        dto.setHostFullName(room.getHost().getFullName());
        dto.setStatus(room.getStatus());
        dto.setCreatedAt(room.getCreatedAt());

        // Determine current user's role
        RoomRole currentRole = null;
        for (RoomMember m : members) {
            if (m.getUser().getId().equals(currentUser.getId())) {
                currentRole = m.getRoomRole();
                break;
            }
        }
        dto.setCurrentUserRole(currentRole);

        // Map members
        List<MemberDto> memberDtos = members.stream()
                .map(m -> new MemberDto(
                        m.getUser().getId(),
                        m.getUser().getUsername(),
                        m.getUser().getFullName(),
                        m.getUser().getAvatarUrl(),
                        m.getRoomRole(),
                        m.getJoinedAt()
                ))
                .collect(Collectors.toList());
        dto.setMembers(memberDtos);

        // Map cart items
        BigDecimal total = BigDecimal.ZERO;
        List<CartItemDto> itemDtos = new ArrayList<>();
        Map<Long, Integer> memberItemCounts = new HashMap<>();
        Map<Long, BigDecimal> memberSubtotals = new HashMap<>();

        for (CartItem item : cartItems) {
            BigDecimal subtotal = item.getSubtotal();
            total = total.add(subtotal);

            Long uId = item.getAddedBy().getId();
            memberItemCounts.put(uId, memberItemCounts.getOrDefault(uId, 0) + item.getQuantity());
            memberSubtotals.put(uId, memberSubtotals.getOrDefault(uId, BigDecimal.ZERO).add(subtotal));

            itemDtos.add(new CartItemDto(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getProduct().getCategory(),
                    item.getProduct().getImageUrl(),
                    item.getUnitPrice(),
                    item.getQuantity(),
                    subtotal,
                    item.getAddedBy().getId(),
                    item.getAddedBy().getUsername(),
                    item.getAddedBy().getFullName(),
                    item.getAddedBy().getAvatarUrl(),
                    item.getUpdatedAt()
            ));
        }
        dto.setCartItems(itemDtos);
        dto.setTotalCartAmount(total);

        // Budget Calculations
        BigDecimal budget = room.getBudgetLimit();
        BigDecimal remaining = budget.subtract(total);
        dto.setRemainingBudget(remaining);
        dto.setIsBudgetExceeded(total.compareTo(budget) > 0);

        if (budget.compareTo(BigDecimal.ZERO) > 0) {
            double usage = total.divide(budget, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
            dto.setBudgetUsagePercentage(Math.round(usage * 100.0) / 100.0);
        } else {
            dto.setBudgetUsagePercentage(0.0);
        }

        // Per-Member Equal Split Calculation
        if (!members.isEmpty()) {
            dto.setPerMemberEqualSplit(total.divide(BigDecimal.valueOf(members.size()), 2, RoundingMode.HALF_UP));
        } else {
            dto.setPerMemberEqualSplit(BigDecimal.ZERO);
        }

        // Member Contributions breakdown
        final BigDecimal finalTotal = total;
        List<MemberContributionDto> contributions = members.stream()
                .map(m -> {
                    Long uId = m.getUser().getId();
                    BigDecimal contrib = memberSubtotals.getOrDefault(uId, BigDecimal.ZERO);
                    int count = memberItemCounts.getOrDefault(uId, 0);
                    double pct = 0.0;
                    if (finalTotal.compareTo(BigDecimal.ZERO) > 0) {
                        pct = contrib.divide(finalTotal, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
                        pct = Math.round(pct * 10.0) / 10.0;
                    }
                    return new MemberContributionDto(
                            uId,
                            m.getUser().getUsername(),
                            m.getUser().getFullName(),
                            m.getUser().getAvatarUrl(),
                            count,
                            contrib,
                            pct
                    );
                })
                .sorted((a, b) -> b.getTotalContribution().compareTo(a.getTotalContribution()))
                .collect(Collectors.toList());
        dto.setContributions(contributions);

        return dto;
    }

    @Transactional
    public RoomDetailsDto updateBudget(String roomCode, UpdateBudgetRequest request, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        // RBAC: Check that current user is HOST
        RoomMember member = memberRepository.findByRoomAndUser(room, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("User is not a member of this room"));

        if (member.getRoomRole() != RoomRole.HOST) {
            throw new IllegalStateException("Only the room Host can update the shared budget");
        }

        if (request.getBudgetLimit() == null || request.getBudgetLimit().compareTo(new BigDecimal("500.00")) < 0) {
            throw new IllegalArgumentException("Minimum budget limit is 500");
        }

        room.setBudgetLimit(request.getBudgetLimit());
        roomRepository.save(room);

        RoomDetailsDto updatedDetails = getRoomDetails(upperCode, currentUser);

        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.BUDGET_UPDATED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                "Budget updated to " + request.getBudgetLimit(),
                updatedDetails
        );

        return updatedDetails;
    }

    @Transactional
    public RoomDetailsDto removeMember(String roomCode, Long targetUserId, User currentUser) {
        String upperCode = roomCode.trim().toUpperCase();
        ShoppingRoom room = roomRepository.findByRoomCode(upperCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + upperCode));

        RoomMember currentMember = memberRepository.findByRoomAndUser(room, currentUser)
                .orElseThrow(() -> new IllegalArgumentException("You are not a member of this room"));

        // Host can remove anyone; user can remove themselves (leave room)
        boolean isSelf = currentUser.getId().equals(targetUserId);
        if (!isSelf && currentMember.getRoomRole() != RoomRole.HOST) {
            throw new IllegalStateException("Only the Host can remove other members");
        }

        // Host cannot remove themselves unless they are the only member
        if (isSelf && currentMember.getRoomRole() == RoomRole.HOST) {
            List<RoomMember> all = memberRepository.findByRoom(room);
            if (all.size() > 1) {
                throw new IllegalStateException("Host cannot leave while other members exist. Transfer host or delete room.");
            }
        }

        RoomMember targetMember = memberRepository.findByRoom(room).stream()
                .filter(m -> m.getUser().getId().equals(targetUserId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Target user is not a member of this room"));

        memberRepository.delete(targetMember);

        RoomDetailsDto updatedDetails = getRoomDetails(upperCode, currentUser);

        notificationService.broadcastToRoom(
                upperCode,
                WebSocketMessage.MessageType.MEMBER_REMOVED,
                currentUser.getUsername(),
                currentUser.getFullName(),
                targetMember.getUser().getFullName() + (isSelf ? " left the room" : " was removed from the room"),
                updatedDetails
        );

        return updatedDetails;
    }

    @Transactional(readOnly = true)
    public List<RoomDetailsDto> getUserRooms(User user) {
        List<RoomMember> memberships = memberRepository.findByUserOrderByJoinedAtDesc(user);
        return memberships.stream()
                .map(m -> getRoomDetails(m.getRoom().getRoomCode(), user))
                .collect(Collectors.toList());
    }
}
