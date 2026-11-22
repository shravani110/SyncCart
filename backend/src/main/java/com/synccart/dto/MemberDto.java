package com.synccart.dto;

import com.synccart.model.RoomRole;
import java.time.LocalDateTime;

public class MemberDto {

    private Long userId;
    private String username;
    private String fullName;
    private String avatarUrl;
    private RoomRole roomRole;
    private LocalDateTime joinedAt;

    public MemberDto() {
    }

    public MemberDto(Long userId, String username, String fullName, String avatarUrl, RoomRole roomRole, LocalDateTime joinedAt) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.roomRole = roomRole;
        this.joinedAt = joinedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
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
