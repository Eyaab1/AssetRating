package com.example.demo.admin;

import com.example.demo.analytics.analyticsService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/analytics/users")
@CrossOrigin(origins = "*")
public class AdminUserAnalyticsController {

    private final analyticsService analyticsService;

    public AdminUserAnalyticsController(analyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalUsers() {
        return ResponseEntity.ok(analyticsService.getTotalUsers());
    }

    @GetMapping("/contributors")
    public ResponseEntity<Integer> getContributorsCount() {
        return ResponseEntity.ok(analyticsService.getContributorsCount());
    }

    @GetMapping("/new-this-month")
    public ResponseEntity<Integer> getUsersRegisteredThisMonth() {
        return ResponseEntity.ok(analyticsService.getUsersRegisteredThisMonth());
    }
    @GetMapping("/active")
    public ResponseEntity<Long> getActiveUsers() {
        return ResponseEntity.ok(analyticsService.getActiveUsersLast30Days());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getUserSummary() {
        Map<String, Object> data = new HashMap<>();
        data.put("total", analyticsService.getTotalUsers());
        data.put("contributors", analyticsService.getContributorsCount());
        data.put("newThisMonth", analyticsService.getUsersRegisteredThisMonth());
        data.put("active", analyticsService.getActiveUsersLast30Days());
        return ResponseEntity.ok(data);
    }

}
