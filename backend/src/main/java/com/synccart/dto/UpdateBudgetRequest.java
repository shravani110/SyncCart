package com.synccart.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class UpdateBudgetRequest {

    @NotNull(message = "Budget limit is required")
    @DecimalMin(value = "1.00", message = "Budget must be at least 1.00")
    private BigDecimal budgetLimit;

    public UpdateBudgetRequest() {
    }

    public UpdateBudgetRequest(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }

    public BigDecimal getBudgetLimit() {
        return budgetLimit;
    }

    public void setBudgetLimit(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }
}
