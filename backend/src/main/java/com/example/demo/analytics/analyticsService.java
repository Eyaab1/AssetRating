package com.example.demo.analytics;

import com.example.demo.asset.model.Status;
import com.example.demo.asset.service.AssetService;
import com.example.demo.auth.AuthService;
import com.example.demo.dto.ModerationResult;
import com.example.demo.review.ReviewAnalysisClient;
import com.example.rating.service.RatingService;
import com.example.review.model.ReviewComment;
import com.example.review.service.ReviewCommentService;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class analyticsService {

    private final AssetService assetService;
    private final AuthService authService;
    private final RatingService ratingService;
    private final ReviewCommentService reviewService;
    private final ReviewAnalysisClient reviewModerationService;

    @Autowired
    public analyticsService(
        AssetService assetService,
        AuthService authService,
        RatingService ratingService,
        ReviewCommentService reviewService,
        ReviewAnalysisClient reviewModerationService
    ) {
        this.assetService = assetService;
        this.authService = authService;
        this.ratingService = ratingService;
        this.reviewService = reviewService;
		this.reviewModerationService = reviewModerationService;
    }

    // ========== CATEGORY / TAG METRICS ==========

    public TopRatedDTO getTopRatedCategory() {
        List<TopRatedDTO> results = assetService.findTopRatedCategory();
        return results.isEmpty() ? new TopRatedDTO("N/A", 0.0) : results.get(0);
    }

    public TopRatedDTO getTopRatedTag() {
        List<TopRatedDTO> results = assetService.findTopRatedTag();
        return results.isEmpty() ? new TopRatedDTO("N/A", 0.0) : results.get(0);
    }

    public List<TopRatedDTO> getAllTopRatedCategories() {
        return assetService.findAllRatedCategories();
    }

    public List<TopRatedDTO> getAllTopRatedTags() {
        return assetService.findAllRatedTags();
    }

    public List<TopRatedDTO> getTopRatedAssets() {
        return assetService.findTopRatedAssets();
    }

    public Map<String, Long> getAssetStatusDistribution() {
        Map<Status, Long> results = assetService.countAssetsByStatus();
        Map<String, Long> statusCountMap = new HashMap<>();
        for (Map.Entry<Status, Long> entry : results.entrySet()) {
            statusCountMap.put(entry.getKey().name(), entry.getValue());
        }
        return statusCountMap;
    }

    public Map<String, Long> getAssetUploadTrend() {
        return assetService.getAllAssets().stream()
            .filter(asset -> asset.getPublishDate() != null)
            .collect(Collectors.groupingBy(
                asset -> asset.getPublishDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    .toString(),
                Collectors.counting()
            ));
    }

    // ========== USER METRICS ==========

    public int getTotalUsers() {
        return authService.getAllUsers().size();
    }
    
    public int getUsersRegisteredThisMonth() {
        return authService.getUsersRegisteredThisMonth().size();
    }
    public int getContributorsCount() {
        return (int) authService.getAllUsers().stream()
            .filter(user -> user.getRole().name().equals("CONTRIBUTOR"))
            .count();
    }

    public long getActiveUsersLast30Days() {
        return authService.countActiveUsersLast30Days();
    }

    // ========== REVIEW METRICS ==========

    public int getTotalReviews() {
        return reviewService.getAllReviews().size();
    }
    
    public Map<String, Integer> getSentimentBreakdown() {
        List<ReviewComment> reviews = reviewService.getAllReviews();
        Map<String, Integer> sentimentMap = new HashMap<>();
        sentimentMap.put("positive", 0);
        sentimentMap.put("negative", 0);

        for (ReviewComment review : reviews) {
            try {
                ModerationResult result = reviewModerationService.analyzeReview(review.getComment());
                String sentiment = result.getSentiment();
                if (sentiment != null && sentimentMap.containsKey(sentiment.toLowerCase())) {
                    sentimentMap.put(sentiment.toLowerCase(), sentimentMap.get(sentiment.toLowerCase()) + 1);
                }
            } catch (Exception e) {
                System.err.println("Sentiment analysis failed for review ID " + review.getId() + ": " + e.getMessage());
            }
        }

        return sentimentMap;
    }
    
    public Map<String, Integer> getSpamBreakdown() {
        List<ReviewComment> reviews = reviewService.getAllReviews();
        Map<String, Integer> spamMap = new HashMap<>();
        spamMap.put("spam", 0);
        spamMap.put("not_spam", 0);

        for (ReviewComment review : reviews) {
            try {
                ModerationResult result = reviewModerationService.analyzeReview(review.getComment());
                String spamLabel = result.getSpamLabel();
                if (spamLabel != null && spamMap.containsKey(spamLabel.toLowerCase())) {
                    spamMap.put(spamLabel.toLowerCase(), spamMap.get(spamLabel.toLowerCase()) + 1);
                }
            } catch (Exception e) {
                System.err.println("Spam check failed for review ID " + review.getId() + ": " + e.getMessage());
            }
        }

        return spamMap;
    }

    public Map<String, Integer> getReviewSentimentBreakdownByAsset(String assetId) {
        List<ReviewComment> reviews = reviewService.getReviewsByAssetId(assetId);
        Map<String, Integer> sentimentMap = new HashMap<>();
        sentimentMap.put("positive", 0);
        sentimentMap.put("negative", 0);

        for (ReviewComment review : reviews) {
            try {
                ModerationResult result = reviewModerationService.analyzeReview(review.getComment());
                String sentiment = result.getSentiment();
                if (sentiment != null && sentimentMap.containsKey(sentiment.toLowerCase())) {
                    sentimentMap.put(sentiment.toLowerCase(), sentimentMap.get(sentiment.toLowerCase()) + 1);
                }
            } catch (Exception e) {
                System.err.println("Sentiment analysis failed for review ID " + review.getId() + " for asset " + assetId + ": " + e.getMessage());
            }
        }

        return sentimentMap;
    }

    public Map<String, Long> getReviewActivityTrend() {
        return reviewService.getAllReviews().stream()
            .filter(review -> review.getCreated_at() != null)
            .collect(Collectors.groupingBy(
                review -> review.getCreated_at().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    .toString(),
                Collectors.counting()
            ));
    }


    // ========== RATING METRICS ==========

    public Map<String, Long> getRatingVolumeTrend() {
        return ratingService.getAllRatings().stream()
            .filter(rating -> rating.getTimestamp() != null)
            .collect(Collectors.groupingBy(
                rating -> rating.getTimestamp().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    .toString(),
                Collectors.counting()
            ));
    }

}
