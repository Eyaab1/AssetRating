package com.example.demo.notification;

import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthRepository authRepository;
    
    public NotificationController(NotificationService notificationService, AuthRepository authRepository) {
    	this.authRepository=authRepository;
    	this.notificationService=notificationService;
    }
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Principal principal) {
        User user = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(notificationService.getNotificationsFor(user));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
}
