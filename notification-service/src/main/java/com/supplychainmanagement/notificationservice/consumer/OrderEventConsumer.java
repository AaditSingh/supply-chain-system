package com.supplychainmanagement.notificationservice.consumer;

import com.supplychainmanagement.notificationservice.dto.NotificationDTO;
import com.supplychainmanagement.notificationservice.event.OrderPlacedEvent;
import com.supplychainmanagement.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "notificationTopic", groupId = "notification-group")
    public void consumeOrderPlacedEvent(OrderPlacedEvent event) {
        log.info("========================================");
        log.info("Received OrderPlacedEvent");
        log.info("========================================");
        log.info("Email sent to {} regarding order #{}", event.getUserEmail(), event.getOrderNumber());
        log.info("========================================");

        // Store notification for frontend access
        NotificationDTO notification = new NotificationDTO(
                event.getOrderNumber(),
                event.getUserEmail(),
                "Email notification sent to " + event.getUserEmail() + " for order #" + event.getOrderNumber(),
                LocalDateTime.now()
        );
        notificationService.addNotification(notification);
    }
}