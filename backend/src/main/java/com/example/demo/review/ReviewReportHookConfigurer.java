package com.example.demo.review;

import com.example.review.service.ReviewCommentReportService;
import com.example.demo.notification.NotificationService;
import com.example.demo.notification.NotificationType;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class ReviewReportHookConfigurer {

    private final NotificationService notificationService;
    private final AssetRepository assetRepository;
    private final AuthRepository authRepository;

    public ReviewReportHookConfigurer(NotificationService notificationService, AssetRepository assetRepository,AuthRepository authRepository) {
        this.notificationService = notificationService;
        this.assetRepository = assetRepository;
        this.authRepository=authRepository;
    }

    @PostConstruct
    public void init() {
    	ReviewCommentReportService.setOnReviewReported((review, reason, reporterId, reportId) -> {
    	    Asset asset = assetRepository.findById(review.getAssetId())
    	        .orElseThrow(() -> new RuntimeException("Asset not found"));

    	    User reporter = authRepository.findById(reporterId)
    	        .orElseThrow(() -> new RuntimeException("Reporter not found"));
    	    String paddedId = String.format("%03d", reportId);
    	    

    	    notificationService.notifyContributorOfReportedReview(review, reason, reporter, paddedId);
    	});

    }


}
