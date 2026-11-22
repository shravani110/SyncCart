package com.synccart.controller;

import com.synccart.dto.CreateRoomRequest;
import com.synccart.dto.JoinRoomRequest;
import com.synccart.dto.RoomDetailsDto;
import com.synccart.dto.UpdateBudgetRequest;
import com.synccart.model.User;
import com.synccart.service.AuthService;
import com.synccart.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final AuthService authService;

    public RoomController(RoomService roomService, AuthService authService) {
        this.roomService = roomService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto room = roomService.createRoom(request, currentUser);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinRoom(@Valid @RequestBody JoinRoomRequest request) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto room = roomService.joinRoom(request.getRoomCode(), currentUser);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<?> getRoomDetails(@PathVariable String roomCode) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto room = roomService.getRoomDetails(roomCode, currentUser);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{roomCode}/budget")
    public ResponseEntity<?> updateBudget(
            @PathVariable String roomCode,
            @Valid @RequestBody UpdateBudgetRequest request) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto room = roomService.updateBudget(roomCode, request, currentUser);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{roomCode}/members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable String roomCode,
            @PathVariable Long userId) {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            RoomDetailsDto room = roomService.removeMember(roomCode, userId, currentUser);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<?> getMyRooms() {
        try {
            User currentUser = authService.getCurrentAuthenticatedUser();
            List<RoomDetailsDto> rooms = roomService.getUserRooms(currentUser);
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
