package com.example.demo.review.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.dto.ModerationResult;
import com.example.demo.dto.ReplyRequest;
import com.example.demo.asset.repository.AssetRepository;
import com.example.review.model.Review;
import com.example.review.service.ReviewService;
import com.example.demo.review.ReviewAnalysisClient;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final AssetRepository assetRepository;
    private final ReviewAnalysisClient reviewModerationService;

    public ReviewController(ReviewService reviewService, AssetRepository assetRepository, ReviewAnalysisClient reviewModerationService) {
        this.reviewService = reviewService;
        this.assetRepository = assetRepository;
        this.reviewModerationService = reviewModerationService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        if (!assetRepository.existsById(request.getAssetId().toString())) {
            return ResponseEntity.badRequest().body("Asset with ID " + request.getAssetId() + " does not exist.");
        }
        Review review = new Review(request.getUserId(), request.getAssetId(), request.getComment());
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<Void> likeReview(@PathVariable Long reviewId, @RequestParam("userId") Long userId) {
        reviewService.addLike(reviewId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/unlike")
    public ResponseEntity<Void> unlikeReview(@PathVariable Long reviewId, @RequestParam("userId") Long userId) {
        reviewService.removeLike(reviewId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<?> addReply(@PathVariable Long reviewId, @RequestBody ReplyRequest replyRequest) {
        Review parent = reviewService.getReviewById(reviewId);
        Review reply = new Review(replyRequest.getUserId(), parent.getAssetId(), replyRequest.getComment());
        reviewService.addReply(reviewId, reply);
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

   // @GetMapping("/all")
    //public ResponseEntity<?> getAllReviews() {
    //List<Review> reviews = reviewService.getAllReviews();
    //  List<Map<String, Object>> enrichedReviews = new ArrayList<>();

    //  for (Review review : reviews) {
    //     Map<String, Object> map = new HashMap<>();
    //      map.put("review", review);
    //      try {
    //          ModerationResult result = reviewModerationService.analyzeReview(review.getComment());
    //          map.put("sentiment", result.getSentiment());
    //         map.put("score", result.getScore());
    //          map.put("containsProfanity", result.isContainsProfanity());
    ////         map.put("spamLabel", result.getSpamLabel());
    //          map.put("spamScore", result.getSpamScore());
    //       } catch (Exception e) {
            	//          map.put("error", "Analysis failed");
    //      }
    //      enrichedReviews.add(map);
    //  }

    //   return ResponseEntity.ok(enrichedReviews);
    //  }

    @GetMapping("/{reviewId}/likes/count")
    public ResponseEntity<Integer> getLikesCount(@PathVariable Long reviewId) {
        try {
            Review review = reviewService.getReviewById(reviewId);
            int likesCount = review.getLikes() != null ? review.getLikes().size() : 0;
            return ResponseEntity.ok(likesCount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(0);
        }
    }

    @GetMapping("/{reviewId}/likes/hasLiked")
    public ResponseEntity<Boolean> hasUserLiked(@PathVariable Long reviewId, @RequestParam Long userId) {
        try {
            Review review = reviewService.getReviewById(reviewId);
            boolean hasLiked = review.getLikes() != null && review.getLikes().contains(userId);
            return ResponseEntity.ok(hasLiked);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
    }
}
