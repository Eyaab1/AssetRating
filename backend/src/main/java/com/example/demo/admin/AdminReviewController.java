package com.example.demo.admin;

import com.example.review.model.ReviewComment;
import com.example.review.model.ReviewCommentReport;
import com.example.review.service.ReviewCommentReportService;
import com.example.review.service.ReviewCommentService;
import com.example.demo.notification.NotificationService;
import com.example.demo.notification.NotificationType;
import com.example.demo.asset.service.AssetService;
import com.example.demo.auth.AuthService;
import com.example.demo.auth.User;
import com.example.demo.dto.AdminReviewReportDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {

    private final ReviewCommentReportService reportService;
    private final ReviewCommentService commentService;
    private final NotificationService notificationService;
    private final AuthService authService;
    private final AssetService assetService;

    public AdminReviewController(
        ReviewCommentReportService reportService,
        ReviewCommentService commentService,
        NotificationService notificationService,
        AuthService authService,
        AssetService assetService
    ) {
        this.reportService = reportService;
        this.commentService = commentService;
        this.notificationService = notificationService;
        this.authService = authService;
        this.assetService=assetService;
    }

    @GetMapping
    public List<AdminReviewReportDTO> getAllEnrichedReports() {
        List<ReviewCommentReport> rawReports = reportService.getAllReports();

        return rawReports.stream().map(report -> {
            ReviewComment review = report.getReview();

            String assetLabel = assetService
                .getLabelById(review.getAssetId())
                .orElse("Unknown");

            User reporter = authService.findById(report.getUserId()).orElse(null);
            User reviewAuthor = authService.findById(review.getUserId()).orElse(null);

            return new AdminReviewReportDTO(
                report.getId(),
                report.getReason(),
                report.getReportedAt(),
                reporter != null ? reporter.getId() : null,
                reporter != null ? reporter.getFullName() : "Unknown",
                reporter != null ? reporter.getEmail() : "Unknown",

                review.getId(),
                review.getComment(),
                review.getAssetId(),
                assetLabel,

                reviewAuthor != null ? reviewAuthor.getId() : null
            );
        }).toList();
    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<String> deleteReportedReview(@PathVariable Long id) {
        ReviewComment review = commentService.getReviewById(id);

        // Remove all reports referencing this review
        List<ReviewCommentReport> reports = reportService.getAllReports().stream()
                .filter(r -> r.getReview().getId().equals(id))
                .toList();

        for (ReviewCommentReport report : reports) {
            reportService.deleteReport(report); // You’ll add this method
        }

        // Get the author
        User author = authService.findById(review.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete the review
        commentService.deleteReview(id);

        // Notify user
        String message = "Your review has been removed for violating our content guidelines.";
        User admin = authService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        notificationService.notifyUser(
                author,
                admin,
                message,
                NotificationType.REVIEW_REMOVED,
                review.getId().toString(),
                review.getAssetId(),
                null
        );

        return ResponseEntity.ok("Review and its reports deleted. User notified.");
    }

}

