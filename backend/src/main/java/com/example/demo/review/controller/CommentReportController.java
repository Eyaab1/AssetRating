package com.example.demo.review.controller;

import com.example.review.model.ReviewComment;
import com.example.review.service.ReviewCommentReportService;
import com.example.review.service.ReviewCommentService;
import com.example.demo.auth.AuthService;
import com.example.demo.auth.User;
import com.example.demo.notification.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class CommentReportController {

    private final ReviewCommentReportService reviewReportService;
    private final ReviewCommentService reviewService;
    private final AuthService authService;

    
    public CommentReportController(ReviewCommentReportService reviewReportService, ReviewCommentService reviewService,
    		AuthService authService) {
		this.reviewReportService = reviewReportService;
		this.reviewService = reviewService;
		this.authService = authService;
	}


    @PostMapping("/{reviewId}/report")
    public ResponseEntity<?> reportReview(@PathVariable Long reviewId,
                                          @RequestBody Map<String, String> body,
                                          Principal principal) {

        String reason = body.get("reason");

        User reporter = authService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long reporterId = reporter.getId();

        ReviewComment review = reviewService.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        User commenter = authService.findById(review.getUserId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        reviewReportService.reportReview(reporterId, review, reason);


        Map<String, String> response = new HashMap<>();
        response.put("message", "Review reported successfully.");
        return ResponseEntity.ok(response);
    }
    @GetMapping("/reports")
    public ResponseEntity<?> getAllReports() {
        return ResponseEntity.ok(reviewReportService.getAllReports());
    }
    
    @GetMapping("/reports/user")
    public ResponseEntity<?> getReportsByCurrentUser(Principal principal) {
        User user = authService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(reviewReportService.getReportsByUser(user.getId()));
    }


}
