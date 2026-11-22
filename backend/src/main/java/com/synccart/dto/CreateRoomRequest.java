package com.synccart.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateRoomRequest {

    @NotBlank(message = "Room name is required")
    private String name;

    @NotNull(message = "Budget limit is required")
    @DecimalMin(value = "1.00", message = "Budget must be at least 1.00")
    private BigDecimal budgetLimit;

    public CreateRoomRequest() {
    }

    public CreateRoomRequest(String name, BigDecimal budgetLimit) {
        this.name = name;
        this.budgetLimit = budgetLimit;
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
}
