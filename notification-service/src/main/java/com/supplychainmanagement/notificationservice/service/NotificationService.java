package com.supplychainmanagement.notificationservice.service;

import com.supplychainmanagement.notificationservice.dto.NotificationDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class NotificationService {

    private final List<NotificationDTO> notifications = Collections.synchronizedList(new ArrayList<>());

    public void addNotification(NotificationDTO notification) {
        notifications.add(notification);
    }

    public List<NotificationDTO> getAllNotifications() {
        return new ArrayList<>(notifications);
    }

    public int getNotificationCount() {
        return notifications.size();
    }
}
