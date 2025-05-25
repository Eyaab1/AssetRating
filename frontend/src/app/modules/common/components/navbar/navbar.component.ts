import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Notification } from '../../../../shared/models/notification';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { getSafeLocalStorage } from '../../../../shared/utils/localstorage';
type GroupKey = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'earlier';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  notifications: Notification[] = [];
  showDropdown = false;
  private role: string | null = null;
  showProfileMenu = false;
  firstNameInitial = '';
  fullName = '';
  groupedNotifications: Record<GroupKey, Notification[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    earlier: [],
  };
  
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
  const token = localStorage?.getItem('token');
  if (!token) return;

  const decoded: any = JSON.parse(atob(token.split('.')[1]));

  // 🔥 Auto-logout if user is deactivated
  if (decoded?.enabled === false) {
    this.logout(); // 👈 call your existing logout function
    return;
  }
  const first = decoded.firstName || '';
      const last = decoded.lastName || '';
      this.firstNameInitial = first.charAt(0).toUpperCase();
      this.fullName = `${first} ${last}`;
      this.role = decoded?.role;
      const userId = decoded?.id;

  this.fetchNotifications();
}

toggleProfileDropdown(): void {
  this.showProfileMenu = !this.showProfileMenu;
}

  fetchNotifications() {
    const token = localStorage?.getItem('token');
    if (!token) return;

    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const role = decoded?.role;

    this.notificationService.getNotifications().subscribe({
      next: (notifs) => {
        this.notifications = notifs.filter(n => {
          if (role === 'CONTRIBUTOR') return true;
          return n.type === 'COMMENT_REPLIED' || n.type === 'REVIEW_LIKED';
        });

        this.notifications = this.notifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.groupNotificationsByDate(this.notifications);
      },
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  groupNotificationsByDate(notifs: Notification[]) {
    const now = new Date();
    const today = new Date(now);
    const yesterday = new Date(now);
    const oneWeekAgo = new Date(now);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    yesterday.setDate(now.getDate() - 1);
    oneWeekAgo.setDate(now.getDate() - 7);

    this.groupedNotifications = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      earlier: [],
    };

    for (const notif of notifs) {
      const created = notif.createdAt instanceof Date
        ? notif.createdAt
        : new Date(notif.createdAt);

      if (created.toDateString() === today.toDateString()) {
        this.groupedNotifications.today.push(notif);
      } else if (created.toDateString() === yesterday.toDateString()) {
        this.groupedNotifications.yesterday.push(notif);
      } else if (created > oneWeekAgo) {
        this.groupedNotifications.thisWeek.push(notif);
      } else if (created > startOfMonth) {
        this.groupedNotifications.thisMonth.push(notif);
      } else {
        this.groupedNotifications.earlier.push(notif);
      }
    }
  }

  getGroupedSections(): { key: GroupKey; label: string }[] {
    return [
      { key: 'today', label: 'Today' },
      { key: 'yesterday', label: 'Yesterday' },
      { key: 'thisWeek', label: 'This Week' },
      { key: 'thisMonth', label: 'This Month' },
      { key: 'earlier', label: 'Earlier' }
    ];
  }

  hasUnread(): boolean {
    return this.notifications.some(n => !n.read);
  }

  goHome() {
  if (this.role === 'USER') {
    this.router.navigate(['/marketplace']);
  } else {
    this.router.navigate(['/contributorLayout/marketplace']);
  
}
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
      }, err => {
        console.error('Failed to mark as read', err);
      });
    }
  }

  getRelativeTime(date: Date | string): string {
    const d = new Date(date);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  }
  expandedSections: { [key in GroupKey]?: boolean } = {};
notificationsLimit = 5;

toggleSectionExpand(section: GroupKey) {
  this.expandedSections[section] = !this.expandedSections[section];
}
goToFullNotifications() {
  if (this.role === 'USER') {
    this.router.navigate(['/notificationAll']);
  } else {
    this.router.navigate(['/contributorLayout/notificationAll']);
  }
}
markAllAsRead() {
  const unread = this.notifications.filter(n => !n.read);
  unread.forEach(n => this.markAsRead(n));
}

navigateBasedOnNotification(notification: Notification): void {
  const assetId = notification.relatedAssetId;
  const reviewId = notification.relatedEntityId;
  const baseRoute = this.role === 'CONTRIBUTOR' ? '/contributorLayout/detail' : '/detail';

  this.markAsRead(notification);

  switch (notification.type) {
    case NotificationType.ASSET_PUBLISHED:
    case NotificationType.ASSET_UPDATED:
      this.router.navigate([`${baseRoute}/${assetId}`]);
      break;

    case NotificationType.REVIEW_ADDED:
    case NotificationType.REVIEW_REPORTED:
    case NotificationType.REVIEW_LIKED:
    case NotificationType.COMMENT_REPLIED:
      this.router.navigate([`${baseRoute}/${assetId}`], {
        queryParams: {
          focusReviewId: reviewId,
          fromReport: notification.type === NotificationType.REVIEW_REPORTED
        }
      });
      break;

    default:
      console.warn('No routing defined for notification type:', notification.type);
      break;
  }

  this.showDropdown = false;
}

getIconClass(type: NotificationType): string {
  switch (type) {
    case NotificationType.REVIEW_REPORTED:
      return 'fas fa-flag'; // 🟥 keep the flag for reports
    case NotificationType.REVIEW_LIKED:
      return 'fas fa-heart'; // ❤️ heart for likes
    case NotificationType.COMMENT_REPLIED:
      return 'fas fa-comment-dots'; // 💬 comment bubble
    case NotificationType.REVIEW_ADDED:
      return 'fas fa-pen'; // ✍️ for a new review
    case NotificationType.ASSET_PUBLISHED:
      return 'fas fa-rocket'; // 🚀 for new asset
    case NotificationType.ASSET_UPDATED:
      return 'fas fa-sync-alt'; // 🔁 for updated asset
    default:
      return 'fas fa-bell'; // 🔔 fallback
  }
}

}
