package com.synccart.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CartItemDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productCategory;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private Long addedByUserId;
    private String addedByUsername;
    private String addedByFullName;
    private String addedByAvatarUrl;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime updatedAt;

    public CartItemDto() {
    }

    public CartItemDto(Long id, Long productId, String productName, String productCategory, String productImageUrl,
                       BigDecimal unitPrice, Integer quantity, BigDecimal subtotal,
                       Long addedByUserId, String addedByUsername, String addedByFullName, String addedByAvatarUrl,
                       LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productCategory = productCategory;
        this.productImageUrl = productImageUrl;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.addedByUserId = addedByUserId;
        this.addedByUsername = addedByUsername;
        this.addedByFullName = addedByFullName;
        this.addedByAvatarUrl = addedByAvatarUrl;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public Long getAddedByUserId() {
        return addedByUserId;
    }

    public void setAddedByUserId(Long addedByUserId) {
        this.addedByUserId = addedByUserId;
    }

    public String getAddedByUsername() {
        return addedByUsername;
    }

    public void setAddedByUsername(String addedByUsername) {
        this.addedByUsername = addedByUsername;
    }

    public String getAddedByFullName() {
        return addedByFullName;
    }

    public void setAddedByFullName(String addedByFullName) {
        this.addedByFullName = addedByFullName;
    }

    public String getAddedByAvatarUrl() {
        return addedByAvatarUrl;
    }

    public void setAddedByAvatarUrl(String addedByAvatarUrl) {
        this.addedByAvatarUrl = addedByAvatarUrl;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
