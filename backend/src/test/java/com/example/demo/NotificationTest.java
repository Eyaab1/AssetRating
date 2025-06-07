package com.example.demo;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.Widget;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthService;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.demo.notification.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)

public class NotificationTest {


    @Mock private NotificationRepository notificationRepository;
    @Mock private AuthService authService;
    @Mock private AssetRepository assetRepository;
    @Mock private SimpMessagingTemplate messagingTemplate;

    @InjectMocks private NotificationService notificationService;

    @Test
    public void testNotifyUser() {
        User actor = new User(); actor.setId(1L); actor.setFirstName("Alice");
        User recipient = new User(); recipient.setId(2L); recipient.setFirstName("Bob");

        Widget asset = new Widget(); asset.setId("asset123"); asset.setName("Demo Asset");

        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        notificationService.notifyUser(
            recipient, actor, "Alice replied to your comment",
            NotificationType.COMMENT_REPLIED,
            "review456", "asset123", asset
        );

        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/notifications/" + recipient.getId()), any(Notification.class));
    }

    @Test
    public void testMarkAsRead() {
        Notification notif = new Notification();
        notif.setId("notif001");
        notif.setRead(false);

        when(notificationRepository.findById("notif001")).thenReturn(Optional.of(notif));

        notificationService.markAsRead("notif001");

        assertTrue(notif.isRead());
        verify(notificationRepository, times(1)).save(notif);
    }
}
