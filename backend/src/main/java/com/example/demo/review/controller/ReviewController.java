package com.example.demo.review.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.dto.ReplyRequest;
import com.example.review.model.Review;
import com.example.review.service.ReviewService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final AssetRepository assetRepository;

    public ReviewController(ReviewService reviewService, AssetRepository assetRepository) {
        this.reviewService = reviewService;
        this.assetRepository = assetRepository;
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
    public ResponseEntity<Void> likeReview(@PathVariable Long reviewId,
                                           @RequestParam("userId") Long userId) {
        reviewService.addLike(reviewId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{reviewId}/unlike")
    public ResponseEntity<Void> unlikeReview(@PathVariable Long reviewId,
                                             @RequestParam("userId") Long userId) {
        reviewService.removeLike(reviewId, userId);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<?> addReply(@PathVariable("reviewId") Long reviewId,
                                      @RequestBody ReplyRequest replyRequest) {
        Review parent = reviewService.getReviewById(reviewId);
        Review reply = new Review(replyRequest.getUserId(), parent.getAssetId(), replyRequest.getComment());
        reviewService.addReply(reviewId, reply);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<?> getReviews(@PathVariable("assetId") String assetId) {
        if (!assetRepository.existsById(assetId)) {
            return ResponseEntity.badRequest().body("Asset with ID " + assetId + " does not exist.");
        }
        return ResponseEntity.ok(reviewService.getReviewsByAssetId(assetId));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReview(@PathVariable("reviewId") Long reviewId) {
        try {
            return ResponseEntity.ok(reviewService.getReviewById(reviewId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found.");
        }
    }
    
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable("reviewId") Long reviewId,
                                          @RequestBody ReplyRequest request) {
        Review updated = reviewService.updateReview(reviewId, request.getComment());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable("reviewId") Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted.");
    }


}
