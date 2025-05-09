package com.example.demo.review.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.dto.ModerationResult;
import com.example.demo.dto.ProfanityCheckResponse;
import com.example.demo.dto.ReplyRequest;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;
import com.example.review.model.Review;
import com.example.review.repository.ReviewRepository;
import com.example.review.service.ReviewService;
import com.example.demo.review.ReviewAnalysisClient;
import com.example.demo.notification.NotificationService;
import com.example.demo.notification.NotificationType;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final AssetRepository assetRepository;
    private final ReviewAnalysisClient reviewModerationService;
    private final NotificationService notificationService;
    private final AuthRepository authRepository;
    private final ReviewRepository reviewRepository;

    // Profanity service URL (Flask microservice)
    private final String PROFANITY_SERVICE_URL = "http://localhost:5000/check_profanity";

    public ReviewController(
            ReviewService reviewService,
            AssetRepository assetRepository,
            ReviewAnalysisClient reviewModerationService,
            NotificationService notificationService,
            AuthRepository authRepository,
            ReviewRepository reviewRepository
    ) {
        this.reviewService = reviewService;
        this.assetRepository = assetRepository;
        this.reviewModerationService = reviewModerationService;
        this.notificationService = notificationService;
        this.authRepository = authRepository;
        this.reviewRepository = reviewRepository;
    }


    private boolean checkProfanity(String assetId, String reviewText) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);  // Set Content-Type to application/json

        // Create the JSON object to send to Flask
        String jsonBody = "{\"assetId\": \"" + assetId + "\", \"comment\": \"" + reviewText + "\"}";
        
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
        
        // Log the request body to check the format
        System.out.println("Sending request to Flask with body: " + jsonBody);
        
        try {
            // Send request to Flask service to check for profanity
            ResponseEntity<ProfanityCheckResponse> response =
                restTemplate.postForEntity(PROFANITY_SERVICE_URL, entity, ProfanityCheckResponse.class);
            
            return response.getBody().isContainsProfanity();
        } catch (Exception e) {
            // Handle any error during the request
            throw new RuntimeException("Error checking profanity with the Flask service: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request, Principal principal) {
        if (!assetRepository.existsById(request.getAssetId().toString())) {
            return ResponseEntity.badRequest().body("Asset with ID " + request.getAssetId() + " does not exist.");
        }

        // Check for profanity in the review text
        if (checkProfanity(request.getAssetId(), request.getComment())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Review contains inappropriate language.");
        }

        User reviewer = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review(reviewer.getId(), request.getAssetId(), request.getComment());
        Review savedReview = reviewService.addReview(review);

        notificationService.notifyContributorByAssetId(
        	    request.getAssetId(),
        	    reviewer,
        	    reviewer.getFirstName() + " " + reviewer.getLastName() + " added a new review on your asset.",
        	    NotificationType.REVIEW_ADDED
        	);


        return ResponseEntity.ok(savedReview);
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<Void> likeReview(@PathVariable Long reviewId, Principal principal) {
        User liker = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        reviewService.addLike(reviewId, liker.getId());

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        notificationService.notifyUserOfLikedReview(review, liker);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<?> addReply(@PathVariable Long reviewId, @RequestBody ReplyRequest replyRequest, Principal principal) {
        Review parent = reviewService.getReviewById(reviewId);

        User replier = authRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Check the reply text, not the parent comment
        if (checkProfanity(parent.getAssetId(), replyRequest.getComment())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reply contains inappropriate language.");
        }

        Review reply = new Review(replier.getId(), parent.getAssetId(), replyRequest.getComment());
        reviewService.addReply(reviewId, reply);

        notificationService.notifyUserOfReply(parent, replier);

        return ResponseEntity.ok().build();
    }


    @GetMapping("/asset/{assetId}")
    public ResponseEntity<?> getReviews(@PathVariable String assetId) {
        if (!assetRepository.existsById(assetId)) {
            return ResponseEntity.badRequest().body("Asset with ID " + assetId + " does not exist.");
        }

        List<Review> reviews = reviewService.getReviewsByAssetId(assetId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReview(@PathVariable Long reviewId) {
        try {
            Review review = reviewService.getReviewById(reviewId);
            ModerationResult analysis = reviewModerationService.analyzeReview(review.getComment());

            Map<String, Object> response = new HashMap<>();
            response.put("review", review);
            response.put("analysis", analysis);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found.");
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReplyRequest request) {
        Review updated = reviewService.updateReview(reviewId, request.getComment());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }
    @PostMapping("/release")
    public ResponseEntity<?> reviewRelease(@RequestBody ReviewRequest request) {
        Review review = new Review();
        review.setUserId(request.getUserId());
        review.setAssetId(request.getAssetId()); // use releasedAsset.id here
        review.setComment(request.getComment());

        reviewService.addReview(review);
        return ResponseEntity.ok("Review submitted for release.");
    }


    @GetMapping("/release/{releasedAssetId}")
    public ResponseEntity<List<Review>> getReviewsForRelease(@PathVariable String releasedAssetId) {
        List<Review> reviews = reviewService.getReviewsByAssetId(releasedAssetId);
        return ResponseEntity.ok(reviews);
    }
}
