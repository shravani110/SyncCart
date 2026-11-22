package com.synccart.dto;

import java.math.BigDecimal;

public class MemberContributionDto {

    private Long userId;
    private String username;
    private String fullName;
    private String avatarUrl;
    private Integer itemsCount = 0;
    private BigDecimal totalContribution = BigDecimal.ZERO;
    private Double percentageOfCart = 0.0;

    public MemberContributionDto() {
    }

    public MemberContributionDto(Long userId, String username, String fullName, String avatarUrl,
                                 Integer itemsCount, BigDecimal totalContribution, Double percentageOfCart) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.itemsCount = itemsCount;
        this.totalContribution = totalContribution;
        this.percentageOfCart = percentageOfCart;
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

    public Integer getItemsCount() {
        return itemsCount;
    }

    public void setItemsCount(Integer itemsCount) {
        this.itemsCount = itemsCount;
    }

    public BigDecimal getTotalContribution() {
        return totalContribution;
    }

    public void setTotalContribution(BigDecimal totalContribution) {
        this.totalContribution = totalContribution;
    }

    public Double getPercentageOfCart() {
        return percentageOfCart;
    }

    public void setPercentageOfCart(Double percentageOfCart) {
        this.percentageOfCart = percentageOfCart;
    }
}
