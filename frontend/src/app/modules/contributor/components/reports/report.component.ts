import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Notification } from '../../../../shared/models/notification';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reports: Notification[] = [];
  filteredReports: Notification[] = [];

  timeRange: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'EARLIER' = 'ALL';
  tab: 'ALL' | 'UNREAD' | 'READ' = 'ALL';

  timeOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Today', value: 'TODAY' },
    { label: 'This Week', value: 'THIS_WEEK' },
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Earlier', value: 'EARLIER' }
  ];

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe({
      next: notifs => {
        this.reports = notifs.filter(n => n.type === 'REVIEW_REPORTED');
        this.filterReports();
      },
      error: err => console.error('Failed to load notifications', err)
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

  markAsRead(report: Notification) {
    if (!report.read) {
      this.notificationService.markAsRead(report.id).subscribe(() => {
        report.read = true;
        this.filterReports();
      });
    }
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

      const created = new Date(report.createdAt); // updated from reportedAt → createdAt
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

  goToReview(report: Notification) {
    this.markAsRead(report);
    this.router.navigate([`/contributorLayout/detail/${report.relatedAssetId}`], {
      queryParams: {
        focusReviewId: report.relatedAssetId,
        fromReport: true,
        highlightReview: report.relatedEntityId

      }
    });
  }
}
