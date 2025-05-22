package com.example.demo.rating.controller;

import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.asset.service.AssetService;
import com.example.demo.dto.RatingRequest;
import com.example.rating.model.Rating;
import com.example.rating.model.UserRatingResponse;
import com.example.rating.service.RatingService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {
	@Autowired
	private AssetService assetService;
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/rate")
    public ResponseEntity<Map<String, String>> rateAsset(@RequestBody RatingRequest request) {
        boolean assetExists = assetService.existsById(request.getAssetId());
        if (!assetExists) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Asset with ID " + request.getAssetId() + " does not exist.");
            return ResponseEntity.badRequest().body(response);
        }

        boolean alreadyRated = ratingService.hasUserRatedAsset(request.getUserId(), request.getAssetId());
        if (alreadyRated) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "You have already rated this asset.");
            return ResponseEntity.badRequest().body(response);
        }

        ratingService.rateAsset(
            request.getUserId(),
            request.getAssetId(),
            request.getFunctionality(),
            request.getPerformance(),
            request.getIntegration(),
            request.getDocumentation()
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "Rating submitted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/average/{assetId}")
    public ResponseEntity<Integer> getOverallRating(@PathVariable("assetId") String assetId) {
        int average = ratingService.getOverallRating(assetId);
        return ResponseEntity.ok(average);
    }
    
    
    @GetMapping("/averageBycategory/{assetId}")
    public ResponseEntity<Map<String, Double>> getCategoryAverages(@PathVariable("assetId") String assetId) {
        Map<String, Double> averages = ratingService.getAverageScoresByCategory(assetId);
        return ResponseEntity.ok(averages);
    }
    
    @GetMapping("/user/{userId}/asset/{assetId}")
    public ResponseEntity<?> getUserRatingForAsset(
            @PathVariable Long userId,
            @PathVariable String assetId) {

        Rating rating = ratingService.getUserRatingForAsset(userId, assetId);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }

        double average = (rating.getFunctionalityScore() +
                          rating.getPerformanceScore() +
                          rating.getIntegrationScore() +
                          rating.getDocumentationScore()) / 4.0;

        Map<String, Object> dto = new HashMap<>();
        dto.put("average", Math.round(average * 10.0) / 10.0); 
        dto.put("functionality", rating.getFunctionalityScore());
        dto.put("performance", rating.getPerformanceScore());
        dto.put("integration", rating.getIntegrationScore());
        dto.put("documentation", rating.getDocumentationScore());

        return ResponseEntity.ok(dto);
    }

//Update 
    @PutMapping("/update")
    public ResponseEntity<?> updateRating(@RequestBody RatingRequest request) {
        boolean assetExists = assetService.existsById(request.getAssetId());
        if (!assetExists) {
            return ResponseEntity.badRequest().body(Map.of("error", "Asset not found."));
        }

        Rating existing = ratingService.getUserRatingForAsset(request.getUserId(), request.getAssetId());
        if (existing == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "No existing rating found to update."));
        }

        existing.setFunctionalityScore(request.getFunctionality());
        existing.setPerformanceScore(request.getPerformance());
        existing.setIntegrationScore(request.getIntegration());
        existing.setDocumentationScore(request.getDocumentation());
        existing.setTimestamp(new java.util.Date());

        ratingService.save(existing); 

        return ResponseEntity.ok(Map.of("message", "Rating updated successfully."));
    }
  
    
    @PostMapping("/release")
    public ResponseEntity<?> rateRelease(@RequestBody RatingRequest request) {
        ratingService.rateAsset(
            request.getUserId(),
            request.getAssetId(),
            request.getFunctionality(),
            request.getPerformance(),
            request.getIntegration(),
            request.getDocumentation()
        );
        return ResponseEntity.ok("Rating submitted for release.");
    }
    @GetMapping("/release/{releasedAssetId}/average")
    public ResponseEntity<?> getReleaseRating(@PathVariable String releasedAssetId) {
        int overallRating = ratingService.getOverallRating(releasedAssetId);
        Map<String, Double> categoryRatings = ratingService.getAverageScoresByCategory(releasedAssetId);
        Map<String, Object> response = new HashMap<>();
        response.put("overall", overallRating);
        response.put("categories", categoryRatings);
        return ResponseEntity.ok(response);
    }
}
