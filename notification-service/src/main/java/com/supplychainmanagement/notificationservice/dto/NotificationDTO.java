package com.supplychainmanagement.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private String orderNumber;
    private String userEmail;
    private String message;
    private LocalDateTime receivedAt;
}
