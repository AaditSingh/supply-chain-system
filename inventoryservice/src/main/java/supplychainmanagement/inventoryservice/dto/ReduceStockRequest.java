package supplychainmanagement.inventoryservice.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReduceStockRequest {
    @NotBlank(message = "SKU Code is required")
    private String skuCode;

    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;
}