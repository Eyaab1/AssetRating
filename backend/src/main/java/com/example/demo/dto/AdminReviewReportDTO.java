package com.example.demo.dto;

import java.util.Date;

public class AdminReviewReportDTO {
    private Long reportId;
    private String reason;
    private Date reportedAt;

    private Long reporterId;
    private String reporterName;
    private String reporterEmail;

    private Long reviewId;
    private String reviewComment;
    private String assetId;
    private String assetLabel;

    private Long reviewAuthorId;

	public AdminReviewReportDTO(Long reportId, String reason, Date reportedAt, Long reporterId, String reporterName,
			String reporterEmail, Long reviewId, String reviewComment, String assetId, String assetLabel,
			Long reviewAuthorId) {
		super();
		this.reportId = reportId;
		this.reason = reason;
		this.reportedAt = reportedAt;
		this.reporterId = reporterId;
		this.reporterName = reporterName;
		this.reporterEmail = reporterEmail;
		this.reviewId = reviewId;
		this.reviewComment = reviewComment;
		this.assetId = assetId;
		this.assetLabel = assetLabel;
		this.reviewAuthorId = reviewAuthorId;
	}

	public Long getReportId() {
		return reportId;
	}

	public void setReportId(Long reportId) {
		this.reportId = reportId;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Date getReportedAt() {
		return reportedAt;
	}

	public void setReportedAt(Date reportedAt) {
		this.reportedAt = reportedAt;
	}

	public Long getReporterId() {
		return reporterId;
	}

	public void setReporterId(Long reporterId) {
		this.reporterId = reporterId;
	}

	public String getReporterName() {
		return reporterName;
	}

	public void setReporterName(String reporterName) {
		this.reporterName = reporterName;
	}

	public String getReporterEmail() {
		return reporterEmail;
	}

	public void setReporterEmail(String reporterEmail) {
		this.reporterEmail = reporterEmail;
	}

	public Long getReviewId() {
		return reviewId;
	}

	public void setReviewId(Long reviewId) {
		this.reviewId = reviewId;
	}

	public String getReviewComment() {
		return reviewComment;
	}

	public void setReviewComment(String reviewComment) {
		this.reviewComment = reviewComment;
	}

	public String getAssetId() {
		return assetId;
	}

	public void setAssetId(String assetId) {
		this.assetId = assetId;
	}

	public String getAssetLabel() {
		return assetLabel;
	}

	public void setAssetLabel(String assetLabel) {
		this.assetLabel = assetLabel;
	}

	public Long getReviewAuthorId() {
		return reviewAuthorId;
	}

	public void setReviewAuthorId(Long reviewAuthorId) {
		this.reviewAuthorId = reviewAuthorId;
	}

    
}
