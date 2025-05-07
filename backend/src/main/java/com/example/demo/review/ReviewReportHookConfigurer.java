package com.example.demo.review;

import com.example.review.service.ReviewCommentReportService;
import com.example.demo.notification.NotificationService;
import com.example.demo.notification.NotificationType;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.repository.AssetRepository;

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class ReviewReportHookConfigurer {

    private final NotificationService notificationService;
    private final AssetRepository assetRepository;

    public ReviewReportHookConfigurer(NotificationService notificationService, AssetRepository assetRepository) {
        this.notificationService = notificationService;
        this.assetRepository = assetRepository;
    }

    @PostConstruct
    public void init() {
        ReviewCommentReportService.setOnReviewReported((assetId, reason) -> {
            Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found: " + assetId));

            String message = "A review on your asset \"" + asset.getName() + "\" was reported for: " + reason;

            notificationService.notifyContributorByAssetId(
                assetId,
                message,
                NotificationType.REVIEW_REPORTED
            );
        });
    }
}
