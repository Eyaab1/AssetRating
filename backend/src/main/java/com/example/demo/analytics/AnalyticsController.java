package com.example.demo.analytics;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
	private final analyticsService analyticsService;

    public AnalyticsController(analyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/top-category")
    public ResponseEntity<TopRatedDTO> getTopCategory() {
        return ResponseEntity.ok(analyticsService.getTopRatedCategory());
    }

    @GetMapping("/top-tag")
    public ResponseEntity<TopRatedDTO> getTopTag() {
        return ResponseEntity.ok(analyticsService.getTopRatedTag());
    }
    @GetMapping("/allToRatedCatg")
    public ResponseEntity<List<TopRatedDTO>> getAllRatedCatg() {
        return ResponseEntity.ok(analyticsService.getAllTopRatedCategories());
    }
    @GetMapping("/allToRatedTags")
    public ResponseEntity<List<TopRatedDTO>> getAllRatedTags() {
        return ResponseEntity.ok(analyticsService.getAllTopRatedTags());
    }
    @GetMapping("/top-rated-assets")
    public ResponseEntity<List<TopRatedDTO>> getTopRatedAssets() {
        return ResponseEntity.ok(analyticsService.getTopRatedAssets());
    }

    @GetMapping("/asset-status-distribution")
    public ResponseEntity<Map<String, Long>> getAssetStatusDistribution() {
        return ResponseEntity.ok(analyticsService.getAssetStatusDistribution());
    }
    @GetMapping("/asset-upload-trend")
    public ResponseEntity<Map<String, Long>> getAssetUploadTrend() {
        return ResponseEntity.ok(analyticsService.getAssetUploadTrend());
    }

    @GetMapping("/review-activity-trend")
    public ResponseEntity<Map<String, Long>> getReviewActivityTrend() {
        return ResponseEntity.ok(analyticsService.getReviewActivityTrend());
    }

    @GetMapping("/rating-volume-trend")
    public ResponseEntity<Map<String, Long>> getRatingVolumeTrend() {
        return ResponseEntity.ok(analyticsService.getRatingVolumeTrend());
    }

    @GetMapping("/review-sentiment")
    public ResponseEntity<Map<String, Integer>> getReviewSentimentBreakdown() {
        return ResponseEntity.ok(analyticsService.getSentimentBreakdown());
    }

    @GetMapping("/review-spam")
    public ResponseEntity<Map<String, Integer>> getSpamBreakdown() {
        return ResponseEntity.ok(analyticsService.getSpamBreakdown());
    }
    
    @GetMapping("/contributorSummary")
    public ResponseEntity<Map<String, Object>> getContributorSummary(@RequestParam String email) {
        return ResponseEntity.ok(analyticsService.getContributorSummary(email));
    }

    @GetMapping("/topdownloadedAssets")
    public ResponseEntity<List<TopRatedDTO>> getTopDownloadedAssets(@RequestParam String email) {
        return ResponseEntity.ok(analyticsService.getTopDownloadedAssetsByContributor(email));
    }
    @GetMapping("/assetAnalytics")
    public ResponseEntity<Map<String, Object>> getAssetAnalytics(@RequestParam String assetId) {
        return ResponseEntity.ok(analyticsService.getAssetAnalytics(assetId));
    }



}
