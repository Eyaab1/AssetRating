package com.example.demo.review.controller;

import com.example.review.model.Review;
import com.example.review.service.ReviewReportService;
import com.example.review.repository.ReviewRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewReportController {

    private final ReviewReportService reviewReportService;
    private final ReviewRepository reviewRepository;
    private final AuthRepository authRepository;

    
    public ReviewReportController(ReviewReportService reviewReportService, ReviewRepository reviewRepository,
			AuthRepository authRepository) {
		this.reviewReportService = reviewReportService;
		this.reviewRepository = reviewRepository;
		this.authRepository = authRepository;
	}


	@PostMapping("/{reviewId}/report")
    public ResponseEntity<?> reportReview(@PathVariable Long reviewId,
                                          @RequestBody Map<String, String> body,
                                          Principal principal) {

        String reason = body.get("reason");
        User user = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        reviewReportService.reportReview(userId, review, reason);

        return ResponseEntity.ok("Review reported successfully.");
    }
}
