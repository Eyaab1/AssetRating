import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReportService } from '../../../../shared/services/report.service';
import { Report } from '../../../../shared/models/report';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reports: (Report & { read?: boolean })[] = [];
  filteredReports: (Report & { read?: boolean })[] = [];

timeRange: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'EARLIER' = 'ALL';
tab: 'ALL' | 'UNREAD' | 'READ' = 'ALL';

timeOptions: { label: string; value: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'EARLIER' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Today', value: 'TODAY' },
  { label: 'This Week', value: 'THIS_WEEK' },
  { label: 'This Month', value: 'THIS_MONTH' },
  { label: 'Earlier', value: 'EARLIER' }
];


  constructor(
    private reportService: ReportService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.reportService.getAllReports().subscribe({
      next: data => {
        this.reports = data.map(r => {
          const report = new Report(r.id, r.reason, new Date(r.reportedAt), r.userId, r.review);
          (report as any).read = false;
          return report;
        });
        this.filterReports();
      },
      error: err => console.error('Failed to load reports', err)
    });
  }

  setTab(tab: 'ALL' | 'UNREAD' | 'READ') {
    this.tab = tab;
    this.filterReports();
  }

  setTimeRange(range: typeof this.timeRange) {
    this.timeRange = range;
    this.filterReports();
  }

  markAsRead(report: Report) {
    this.notificationService.getNotifications().subscribe(notifs => {
      const match = notifs.find(n =>
        n.type === 'REVIEW_REPORTED' &&
        n.relatedEntityId === report.review.id.toString()
      );

      if (match && !match.read) {
        this.notificationService.markAsRead(match.id).subscribe(() => {
          (report as any).read = true;
        });
      }
    });
  }


  filterReports() {
    const now = new Date();
    const today = new Date(now);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    this.filteredReports = this.reports.filter(report => {
      if (this.tab === 'UNREAD' && report.read) return false;
      if (this.tab === 'READ' && !report.read) return false;

      const created = new Date(report.reportedAt);
      switch (this.timeRange) {
        case 'TODAY':
          if (created.toDateString() !== today.toDateString()) return false;
          break;
        case 'THIS_WEEK':
          if (created <= thisWeekStart) return false;
          break;
        case 'THIS_MONTH':
          if (created < thisMonthStart) return false;
          break;
        case 'EARLIER':
          if (created >= thisMonthStart) return false;
          break;
      }

      return true;
    });
  }

  goToReview(report: Report) {
    this.markAsRead(report);
    this.router.navigate([`/detail/${report.review.assetId}`], {
      queryParams: { focusReviewId: report.review.id }
    });
  }
}
