package com.supplychainmanagement.orderservice.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.supplychainmanagement.orderservice.client.InventoryClient;
import com.supplychainmanagement.orderservice.dto.OrderLineItemDTO;
import com.supplychainmanagement.orderservice.dto.OrderRequestDTO;
import com.supplychainmanagement.orderservice.dto.OrderResponseDTO;
import com.supplychainmanagement.orderservice.entity.Order;
import com.supplychainmanagement.orderservice.entity.OrderLineItem;
import com.supplychainmanagement.orderservice.event.OrderPlacedEvent;
import com.supplychainmanagement.orderservice.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    @Transactional
    public OrderResponseDTO placeOrder(OrderRequestDTO orderRequestDTO) {
        log.info("Placing order for user: {}", orderRequestDTO.getUserEmail());

        // Check inventory for all items
        for (OrderLineItemDTO item : orderRequestDTO.getOrderLineItems()) {
            try {
                var inventoryResponse = inventoryClient.checkInventory(item.getSkuCode());
                if (!inventoryResponse.isInStock() || inventoryResponse.getAvailableQuantity() < item.getQuantity()) {
                    log.warn("Insufficient inventory for SKU: {}", item.getSkuCode());
                    throw new RuntimeException("Insufficient inventory for SKU: " + item.getSkuCode());
                }
            } catch (Exception e) {
                log.error("Error checking inventory for SKU: {}", item.getSkuCode(), e);
                throw new RuntimeException("Error checking inventory: " + e.getMessage());
            }
        }

        // Create order
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setUserEmail(orderRequestDTO.getUserEmail());
        order.setStatus("PENDING");

        List<OrderLineItem> lineItems = orderRequestDTO.getOrderLineItems().stream()
                .map(itemDTO -> {
                    OrderLineItem lineItem = new OrderLineItem();
                    lineItem.setSkuCode(itemDTO.getSkuCode());
                    lineItem.setQuantity(itemDTO.getQuantity());
                    lineItem.setPrice(itemDTO.getPrice());
                    lineItem.setOrder(order);
                    return lineItem;
                })
                .collect(Collectors.toList());

        order.setOrderLineItems(lineItems);
        Order savedOrder = orderRepository.save(order);

        log.info("Order placed successfully with order number: {}", savedOrder.getOrderNumber());

        // Publish event
        OrderPlacedEvent event = new OrderPlacedEvent(savedOrder.getOrderNumber(), savedOrder.getUserEmail());
        kafkaTemplate.send("notificationTopic", event);
        log.info("OrderPlacedEvent published for order: {}", savedOrder.getOrderNumber());

        return mapToDTO(savedOrder);
    }

    public List<OrderResponseDTO> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private OrderResponseDTO mapToDTO(Order order) {
        List<OrderLineItemDTO> lineItemDTOs = order.getOrderLineItems().stream()
                .map(item -> new OrderLineItemDTO(item.getSkuCode(), item.getQuantity(), item.getPrice()))
                .collect(Collectors.toList());

        return new OrderResponseDTO(
                order.getId(),
                order.getOrderNumber(),
                order.getUserEmail(),
                lineItemDTOs,
                order.getCreatedAt(),
                order.getStatus()
        );
    }
}