export class Report {
  constructor(
    public id: number,
    public reason: string,
    public reportedAt: Date,
    public userId: number,
    public review: {
      id: number;
      comment: string;
      assetId: string;
    }
  ) {}

  getSummary(): string {
    return `Reported review "${this.review.comment}" for reason: "${this.reason}"`;
  }

  getReportedDateOnly(): string {
    return new Date(this.reportedAt).toLocaleDateString();
  }
}
