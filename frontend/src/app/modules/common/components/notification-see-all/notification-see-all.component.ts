import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../../shared/models/notification';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { FormsModule } from '@angular/forms';
type TimeRange = 'ALL' | 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'EARLIER';
type TypeFilter = 'ALL' | NotificationType;

@Component({
  selector: 'app-notification-see-all',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './notification-see-all.component.html',
  styleUrl: './notification-see-all.component.css'
})
export class NotificationSeeAllComponent implements OnInit {
 notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];

  timeRange: TimeRange = 'ALL';
  typeFilter: TypeFilter = 'ALL';
  tab: 'ALL' | 'UNREAD' | 'READ' = 'ALL';

  currentUserId: number | null = null;

  timeOptions: { label: string; value: TimeRange }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Today', value: 'TODAY' },
    { label: 'This Week', value: 'THIS_WEEK' },
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Earlier', value: 'EARLIER' }
  ];

  typeOptions: { label: string; value: TypeFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Review Reported', value: NotificationType.REVIEW_REPORTED },
    { label: 'Review Liked', value: NotificationType.REVIEW_LIKED },
    { label: 'Comment Replied', value: NotificationType.COMMENT_REPLIED },
    { label: 'Review Added', value: NotificationType.REVIEW_ADDED },
    { label: 'Asset Published', value: NotificationType.ASSET_PUBLISHED },
    { label: 'Asset Updated', value: NotificationType.ASSET_UPDATED }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = decoded?.id;
    }

    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe((data) => {
      this.notifications = data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.filterNotifications();
    });
  }

  setTab(tab: 'ALL' | 'UNREAD' | 'READ') {
    this.tab = tab;
    this.filterNotifications();
  }

  setTimeRange(range: TimeRange) {
    this.timeRange = range;
    this.filterNotifications();
  }

  setTypeFilter(filter: TypeFilter) {
    this.typeFilter = filter;
    this.filterNotifications();
  }

  filterNotifications(): void {
    const now = new Date();
    const today = new Date(now);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    this.filteredNotifications = this.notifications.filter((n) => {
      // ✅ Skip self-triggered
      if (n.actorId === this.currentUserId) return false;

      if (this.tab === 'UNREAD' && n.read) return false;
      if (this.tab === 'READ' && !n.read) return false;

      const created = new Date(n.createdAt);

      // Time filter
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

      // Type filter
      if (this.typeFilter !== 'ALL' && n.type !== this.typeFilter) return false;

      return true;
    });
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
      });
    }
  }
}
