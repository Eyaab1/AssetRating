package com.example.demo.review.controller;

import com.example.review.service.ReviewService;
import com.example.review.model.Review;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{assetId}")
    public Review addReview(@PathVariable Long assetId, @RequestBody Review review) {
        review.setAssetId(assetId);
        return reviewService.addReview(review);
    }

    @GetMapping("/{assetId}")
    public List<Review> getReviewsByAsset(@PathVariable Long assetId) {
        return reviewService.getReviewsByAssetId(assetId);
    }

    @PostMapping("/like/{reviewId}/{userId}")
    public void addLike(@PathVariable Long reviewId, @PathVariable Long userId) {
        reviewService.addLike(reviewId, userId);
    }

    @PostMapping("/reply/{reviewId}")
    public void addReply(@PathVariable Long reviewId, @RequestBody Review reply) {
        reviewService.addReply(reviewId, reply);
    }
}
