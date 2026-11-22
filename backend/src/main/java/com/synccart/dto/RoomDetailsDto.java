package com.synccart.dto;

import com.synccart.model.RoomRole;
import com.synccart.model.RoomStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RoomDetailsDto {

    private Long id;
    private String roomCode;
    private String name;
    private BigDecimal budgetLimit;
    private Long hostId;
    private String hostUsername;
    private String hostFullName;
    private RoomStatus status;
    private LocalDateTime createdAt;
    private RoomRole currentUserRole; // Role of current requester

    private BigDecimal totalCartAmount = BigDecimal.ZERO;
    private BigDecimal remainingBudget = BigDecimal.ZERO;
    private Boolean isBudgetExceeded = false;
    private Double budgetUsagePercentage = 0.0;
    private BigDecimal perMemberEqualSplit = BigDecimal.ZERO;

    private List<MemberDto> members = new ArrayList<>();
    private List<CartItemDto> cartItems = new ArrayList<>();
    private List<MemberContributionDto> contributions = new ArrayList<>();

    public RoomDetailsDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getBudgetLimit() {
        return budgetLimit;
    }

    public void setBudgetLimit(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public String getHostUsername() {
        return hostUsername;
    }

    public void setHostUsername(String hostUsername) {
        this.hostUsername = hostUsername;
    }

    public String getHostFullName() {
        return hostFullName;
    }

    public void setHostFullName(String hostFullName) {
        this.hostFullName = hostFullName;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public RoomRole getCurrentUserRole() {
        return currentUserRole;
    }

    public void setCurrentUserRole(RoomRole currentUserRole) {
        this.currentUserRole = currentUserRole;
    }

    public BigDecimal getTotalCartAmount() {
        return totalCartAmount;
    }

    public void setTotalCartAmount(BigDecimal totalCartAmount) {
        this.totalCartAmount = totalCartAmount;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public Boolean getIsBudgetExceeded() {
        return isBudgetExceeded;
    }

    public void setIsBudgetExceeded(Boolean isBudgetExceeded) {
        this.isBudgetExceeded = isBudgetExceeded;
    }

    public Double getBudgetUsagePercentage() {
        return budgetUsagePercentage;
    }

    public void setBudgetUsagePercentage(Double budgetUsagePercentage) {
        this.budgetUsagePercentage = budgetUsagePercentage;
    }

    public BigDecimal getPerMemberEqualSplit() {
        return perMemberEqualSplit;
    }

    public void setPerMemberEqualSplit(BigDecimal perMemberEqualSplit) {
        this.perMemberEqualSplit = perMemberEqualSplit;
    }

    public List<MemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<MemberDto> members) {
        this.members = members;
    }

    public List<CartItemDto> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDto> cartItems) {
        this.cartItems = cartItems;
    }

    public List<MemberContributionDto> getContributions() {
        return contributions;
    }

    public void setContributions(List<MemberContributionDto> contributions) {
        this.contributions = contributions;
    }
}
