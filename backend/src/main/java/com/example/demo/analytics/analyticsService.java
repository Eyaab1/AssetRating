package com.example.demo.analytics;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.service.AssetService;
import com.example.demo.auth.AuthService;
import com.example.demo.auth.UserDTO;
import com.example.demo.dto.ModerationResult;
import com.example.demo.dto.UserActivityDTO;
import com.example.demo.review.ReviewAnalysisClient;
import com.example.rating.service.RatingService;
import com.example.review.model.ReviewComment;
import com.example.review.service.ReviewCommentService;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.DayOfWeek;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
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
    
    public Asset getMostDownloadedAsset() {
        return assetService.getAllAssets().stream()
            .filter(a -> a.getDownloadCount() != null)
            .max(Comparator.comparingLong(Asset::getDownloadCount))
            .orElse(null);
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
    public Map<String, Object> getContributorSummary(String email) {
        Map<String, Object> summary = new HashMap<>();

        // Filter all contributor assets
        List<Asset> contributorAssets = assetService.getAllAssets().stream()
            .filter(asset -> asset.getPublisherMail() != null && asset.getPublisherMail().equalsIgnoreCase(email))
            .toList();

        // Most Downloaded Asset (assuming you store a download count)
        Asset mostDownloaded = contributorAssets.stream()
            .max((a1, a2) -> Long.compare(
                a1.getDownloadCount() != null ? a1.getDownloadCount() : 0,
                a2.getDownloadCount() != null ? a2.getDownloadCount() : 0))
            .orElse(null);

        int totalReviews = contributorAssets.stream()
            .mapToInt(asset -> reviewService.getReviewsByAssetId(asset.getId()).size())
            .sum();

        double totalRatings = contributorAssets.stream()
                .mapToDouble(asset -> {
                    try {
                        int rating = ratingService.getOverallRating(asset.getId());
                        return rating != 0? rating : 0;
                    } catch (Exception e) {
                        System.err.println("Error fetching rating for asset " + asset.getId() + ": " + e.getMessage());
                        return 0;
                    }
                })
                .sum();

        long totalDownloads = contributorAssets.stream()
            .mapToLong(asset -> asset.getDownloadCount() != null ? asset.getDownloadCount() : 0)
            .sum();

        summary.put("totalReviews", totalReviews);
        summary.put("totalRatings", totalRatings);
        summary.put("totalDownloads", totalDownloads);

        if (mostDownloaded != null) {
            Map<String, Object> mostDownloadedAsset = new HashMap<>();
            mostDownloadedAsset.put("name", mostDownloaded.getName());
            mostDownloadedAsset.put("downloads", mostDownloaded.getDownloadCount());
            summary.put("mostDownloadedAsset", mostDownloadedAsset);
        } else {
            summary.put("mostDownloadedAsset", null);
        }

        return summary;
    }
    
    public List<TopRatedDTO> getTopDownloadedAssetsByContributor(String email) {
        return assetService.getAllAssets().stream()
            .filter(asset -> email.equalsIgnoreCase(asset.getPublisherMail()))
            .sorted((a1, a2) -> Long.compare(
                a2.getDownloadCount() != null ? a2.getDownloadCount() : 0,
                a1.getDownloadCount() != null ? a1.getDownloadCount() : 0))
            .limit(5)
            .map(asset -> new TopRatedDTO(
                asset.getName(),
                (double) (asset.getDownloadCount() != null ? asset.getDownloadCount() : 0)
            ))
            .toList();
    }

    // ========== USER METRICS ==========

    public int getTotalUsers() {
        return authService.getAllUsers().size();
    }
    
    public int getUsersRegisteredThisMonth() {
        return authService.getUsersRegisteredThisMonth().size();
    }
    public List<UserDTO> getNewUsersThisMonth() {
        return authService.getUsersRegisteredThisMonth();
    }

    public int getUserCountByRole(String role) {
        return (int) authService.getAllUsers().stream()
            .filter(user -> user.getRole().name().equalsIgnoreCase(role))
            .count();
    }

    public long getActiveUsersLast30Days() {
        return authService.countActiveUsersLast30Days();
    }
    public List<UserActivityDTO> getMostActiveUsers() {
        return authService.getAllUsers().stream()
            .filter(user -> user.getRole().name().equals("USER"))
            .map(user -> {
                int reviews = reviewService.countByUser(user.getId());
                int ratings = ratingService.countByUser(user.getId());
                int replies = reviewService.countRepliesByUser(user.getId());
                int score = reviews + ratings + replies ;

                return new UserActivityDTO(user, score);
            })
            .sorted(Comparator.comparingInt(UserActivityDTO::getActivityScore).reversed())
            .limit(5)
            .collect(Collectors.toList());
    }
    public List<UserActivityDTO> getTopContributors() {
        return authService.getAllUsers().stream()
            .filter(user -> user.getRole().name().equals("CONTRIBUTOR"))
            .map(user -> {
                int uploads = assetService.countByPublisherId(user.getId());
                return new UserActivityDTO(user, uploads);
            })
            .sorted(Comparator.comparingInt(UserActivityDTO::getActivityScore).reversed())
            .limit(5)
            .collect(Collectors.toList());
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
        spamMap.put("ham", 0);

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
    public Map<String, Integer> getSpamBreakdownByAsset(String assetId) {
        List<ReviewComment> reviews = reviewService.getReviewsByAssetId(assetId);
        Map<String, Integer> spamMap = new HashMap<>();
        spamMap.put("spam", 0);
        spamMap.put("ham", 0);

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
    
  public Map<Object, Long> getAssetRatingDistribution() {
     return ratingService.getAllRatings().stream()
         .collect(Collectors.groupingBy(
             rating -> rating.getRatingValue(),
              Collectors.counting()
            ));
    }

    public Map<String, Object> getAssetAnalytics(String assetId) {
        Map<String, Object> analytics = new HashMap<>();
        try {
            Asset asset = assetService.getAssetById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + assetId));
            analytics.put("downloadCount", asset.getDownloadCount() != null ? asset.getDownloadCount() : 0);
        } catch (Exception e) {
            analytics.put("downloadCount", 0);
        }
        try {
            int rating = ratingService.getOverallRating(assetId);
            analytics.put("averageRating", rating != 0 ? rating : 0);
        } catch (Exception e) {
            analytics.put("averageRating", 0);
        }

        try {
            analytics.put("reviewCount", reviewService.getReviewsByAssetId(assetId).size());
        } catch (Exception e) {
            analytics.put("reviewCount", 0);
        }
        try {
            List<ReviewComment> allReviews = reviewService.getReviewsByAssetId(assetId);

            List<Map<String, Object>> recentReviews = allReviews.stream()
                .filter(review -> review.getComment() != null && review.getComment().startsWith("__REVIEW__"))
                .sorted((a, b) -> b.getCreated_at().compareTo(a.getCreated_at()))
                .limit(5)
                .map(review -> {
                    Map<String, Object> map = new HashMap<>();

                    String username = authService.getUserById(review.getUserId())
                        .map(user -> user.getFirstName())
                        .orElse("Unknown");

                    map.put("user", username);
                    map.put("comment", review.getComment().replace("__REVIEW__", "").trim()); // clean it up
                    map.put("createdAt", review.getCreated_at());
                    map.put("rating", ratingService.getOverallRating(assetId));

                    return map;
                }).toList();

            analytics.put("recentReviews", recentReviews);


        } catch (Exception e) {
            analytics.put("recentReviews", List.of());
        }
        analytics.put("sentimentBreakdown", getReviewSentimentBreakdownByAsset(assetId));
        analytics.put("spamBreakdown", getSpamBreakdownByAsset(assetId));
        analytics.put("ratingDistribution", ratingService.getRatingDistribution(assetId));
        analytics.put("ratingCommentTrend", getRatingAndCommentTrendByAsset(assetId));

        return analytics;
    }
    public Map<String, Map<String, Integer>> getRatingAndCommentTrendByAsset(String assetId) {
        Map<String, Map<String, Integer>> trend = new HashMap<>();

        // Group comments by week/month
        List<ReviewComment> comments = reviewService.getReviewsByAssetId(assetId);
        for (ReviewComment comment : comments) {
            if (comment.getCreated_at() == null) continue;

            String period = comment.getCreated_at().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .toString();

            trend.putIfAbsent(period, new HashMap<>());
            Map<String, Integer> entry = trend.get(period);
            entry.put("comment", entry.getOrDefault("comment", 0) + 1);
        }

        // Group ratings by week/month
        ratingService.getAllRatings().stream()
            .filter(rating -> assetId.equals(rating.getAssetId()) && rating.getTimestamp() != null)
            .forEach(rating -> {
                String period = rating.getTimestamp().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    .toString();
                trend.putIfAbsent(period, new HashMap<>());
                Map<String, Integer> entry = trend.get(period);
                entry.put("rating", entry.getOrDefault("rating", 0) + 1);
            });
        
        return trend;
    }
    
    public Map<Integer, Long> getRatingDistributionForAsset(String assetId) {
        return ratingService.getRatingDistribution(assetId);
    }
    
    public Map<String, Long> getTopKeywords(String assetId, int limit) {
        return reviewService.getTopKeywords(assetId, limit);
    }

    
    

}
