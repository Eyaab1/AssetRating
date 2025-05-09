import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Notification } from '../../../../shared/models/notification';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { getSafeLocalStorage } from '../../../../shared/utils/localstorage';

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

  groupedNotifications = {
    today: [] as Notification[],
    yesterday: [] as Notification[],
    thisWeek: [] as Notification[],
    thisMonth: [] as Notification[],
    earlier: [] as Notification[],
  };
  
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const token = getSafeLocalStorage()?.getItem('token');
    if (!token) return;
  
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const role = decoded?.role;
    const userId = decoded?.id; // 👈 make sure the token has user ID
  
    console.log('Decoded token:', decoded);
    console.log('User role:', role);
  
    // ✅ SSR-safe: Only connect to socket on client
    if (typeof window !== 'undefined' && userId) {
      // this.notificationService.connectToSocket(userId);
    }
  
    this.fetchNotifications(); // fetch only after checking token
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
      const created = new Date(notif.createdAt);

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
getGroupedSections() {
  return [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'thisWeek', label: 'This Week' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'earlier', label: 'Earlier' }
  ];
}

fetchNotifications() {
  const token = getSafeLocalStorage()?.getItem('token');
  if (!token) return;

  const decoded: any = JSON.parse(atob(token.split('.')[1]));
  const role = decoded?.role;
  console.log('Decoded token:', decoded);
  console.log('User role:', role);
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



  hasUnread(): boolean {
    return this.notifications.some(n => !n.read);
  }
  
  goHome() {
    this.router.navigate(['/marketplace']);
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
}
