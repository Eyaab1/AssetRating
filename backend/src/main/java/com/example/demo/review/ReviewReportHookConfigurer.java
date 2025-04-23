package com.example.demo.review;

import com.example.review.service.ReviewReportService;
import com.example.review.Impl.OnReviewReported;
import com.example.demo.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class ReviewReportHookConfigurer {

    private final NotificationService notificationService;

    public ReviewReportHookConfigurer(NotificationService notificationService) {
    	this.notificationService=notificationService;
    }
    @PostConstruct
    public void init() {
        ReviewReportService.setOnReviewReported((assetId, reason) -> {
            String message = "A review on your asset (ID: " + assetId + ") was reported for: " + reason;
            notificationService.notifyContributorByAssetId(assetId, message);
        });
    }
}
