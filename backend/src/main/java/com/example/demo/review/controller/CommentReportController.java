package com.example.demo.review.controller;

import com.example.review.model.ReviewComment;
import com.example.review.service.ReviewCommentReportService;
import com.example.review.repository.ReviewCommentRepository;
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
public class CommentReportController {

    private final ReviewCommentReportService reviewReportService;
    private final ReviewCommentRepository reviewRepository;
    private final AuthRepository authRepository;
    private final NotificationService notificationService;

    
    public CommentReportController(ReviewCommentReportService reviewReportService, ReviewCommentRepository reviewRepository,
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

        ReviewComment review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        User commenter = authRepository.findById(review.getUserId())
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
        User user = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(reviewReportService.getReportsByUser(user.getId()));
    }


}
