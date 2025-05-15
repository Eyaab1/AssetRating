export interface AdminReviewReport {
  reportId: number;
  reason: string;
  reportedAt: string;

  reporterId: number;
  reporterName: string;
  reporterEmail: string;

  reviewId: number;
  reviewComment: string;
  assetId: string;
  assetLabel: string;

  reviewAuthorId: number;
}
