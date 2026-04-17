package com.supplychainmanagement.notificationservice.controller;

import com.supplychainmanagement.notificationservice.dto.NotificationDTO;
import com.supplychainmanagement.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        log.info("Fetching all notifications");
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getNotificationCount() {
        return ResponseEntity.ok(Map.of("count", notificationService.getNotificationCount()));
    }
}
