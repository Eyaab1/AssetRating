package com.example.demo.review.controller;

import com.example.review.model.Review;
import com.example.review.service.ReviewReportService;
import com.example.review.repository.ReviewRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;
import com.example.demo.notification.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewReportController {

    private final ReviewReportService reviewReportService;
    private final ReviewRepository reviewRepository;
    private final AuthRepository authRepository;
    private final NotificationService notificationService;

    
    public ReviewReportController(ReviewReportService reviewReportService, ReviewRepository reviewRepository,
			AuthRepository authRepository,NotificationService notificationService) {
		this.reviewReportService = reviewReportService;
		this.reviewRepository = reviewRepository;
		this.authRepository = authRepository;
		this.notificationService=notificationService;
	}


    @PostMapping("/{reviewId}/report")
    public ResponseEntity<?> reportReview(@PathVariable Long reviewId,
                                          @RequestBody Map<String, String> body,
                                          Principal principal) {

        String reason = body.get("reason");

        User reporter = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long reporterId = reporter.getId();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        User commenter = authRepository.findById(review.getUserId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        reviewReportService.reportReview(reporterId, review, reason);


        Map<String, String> response = new HashMap<>();
        response.put("message", "Review reported successfully.");
        return ResponseEntity.ok(response);
    }
}
