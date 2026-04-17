package com.supplychainmanagement.orderservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    @NotBlank(message = "User email is required")
    @Email(message = "Email should be valid")
    private String userEmail;

    @NotEmpty(message = "Order must contain at least one line item")
    @Valid
    private List<OrderLineItemDTO> orderLineItems;
}