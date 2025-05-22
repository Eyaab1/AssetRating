package com.example.demo.admin;

import com.example.demo.analytics.analyticsService;
import com.example.demo.auth.UserDTO;
import com.example.demo.dto.UserActivityDTO;

import java.util.HashMap;
import java.util.List;
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

    @GetMapping("/count-by-role")
    public ResponseEntity<Integer> getUserCountByRole(@RequestParam String role) {
        return ResponseEntity.ok(analyticsService.getUserCountByRole(role));
    }


    @GetMapping("/new-this-month")
    public ResponseEntity<Integer> getUsersRegisteredThisMonth() {
        return ResponseEntity.ok(analyticsService.getUsersRegisteredThisMonth());
    }
    @GetMapping("/new-this-month/list")
    public ResponseEntity<List<UserDTO>> getNewUsersList() {
        return ResponseEntity.ok(analyticsService.getNewUsersThisMonth());
    }

    @GetMapping("/active")
    public ResponseEntity<Long> getActiveUsers() {
        return ResponseEntity.ok(analyticsService.getActiveUsersLast30Days());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getUserSummary() {
        Map<String, Object> data = new HashMap<>();
        data.put("total", analyticsService.getTotalUsers());
        data.put("contributors", analyticsService.getUserCountByRole("CONTRIBUTOR"));
        data.put("admins", analyticsService.getUserCountByRole("ADMIN"));
        data.put("users", analyticsService.getUserCountByRole("USER"));
        data.put("newThisMonth", analyticsService.getUsersRegisteredThisMonth());
        data.put("Active Users Last 30 Days", analyticsService.getActiveUsersLast30Days());
        return ResponseEntity.ok(data);
    }

    @GetMapping("/active-users")
    public ResponseEntity<List<UserActivityDTO>> getMostActiveUsers() {
        return ResponseEntity.ok(analyticsService.getMostActiveUsers());
    }

    @GetMapping("/top-contributors")
    public ResponseEntity<List<UserActivityDTO>> getTopContributors() {
        return ResponseEntity.ok(analyticsService.getTopContributors());
    }
    

}
