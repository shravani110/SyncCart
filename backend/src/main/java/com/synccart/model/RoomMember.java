package com.synccart.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"room_id", "user_id"})
})
public class RoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnoreProperties({"members", "cartItems"})
    private ShoppingRoom room;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomRole roomRole = RoomRole.MEMBER;

    @Column(nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public RoomMember() {
    }

    public RoomMember(ShoppingRoom room, User user, RoomRole roomRole) {
        this.room = room;
        this.user = user;
        this.roomRole = roomRole != null ? roomRole : RoomRole.MEMBER;
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ShoppingRoom getRoom() {
        return room;
    }

    public void setRoom(ShoppingRoom room) {
        this.room = room;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public RoomRole getRoomRole() {
        return roomRole;
    }

    public void setRoomRole(RoomRole roomRole) {
        this.roomRole = roomRole;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
