package com.synccart.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.synccart.model.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {

    private Long id;
    private String orderNumber;
    private String roomCode;
    private Long hostId;
    private String hostUsername;
    private String hostFullName;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String paymentMethod;
    private String shippingAddress;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime createdAt;
    private List<OrderItemDto> items = new ArrayList<>();
    private List<MemberContributionDto> contributions = new ArrayList<>();

    public OrderDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }

    public List<MemberContributionDto> getContributions() {
        return contributions;
    }

    public void setContributions(List<MemberContributionDto> contributions) {
        this.contributions = contributions;
    }

    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal subtotal;
        private String addedByUsername;
        private String addedByFullName;

        public OrderItemDto() {
        }

        public OrderItemDto(Long id, Long productId, String productName, BigDecimal unitPrice, Integer quantity, BigDecimal subtotal, String addedByUsername, String addedByFullName) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
            this.subtotal = subtotal;
            this.addedByUsername = addedByUsername;
            this.addedByFullName = addedByFullName;
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

        public String getAddedByUsername() {
            return addedByUsername;
        }

        public void setAddedByUsername(String addedByUsername) {
            this.addedByUsername = addedByUsername;
        }

        public String getAddedByFullName() {
            return addedByFullName;
        }

        public void setFullName(String addedByFullName) {
            this.addedByFullName = addedByFullName;
        }
    }
}
