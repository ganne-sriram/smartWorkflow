import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentDateTime: string = '';
  private intervalId: any;
  showUserMenu: boolean = false;
  showNotifications: boolean = false;
  notifications: Notification[] = [];
  unreadCount: number = 0;
  private notificationSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.updateDateTime();
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Subscribe to notifications
    this.notificationSubscription = this.notificationService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
        this.unreadCount = notifications.filter(n => !n.read).length;
      }
    );
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false; // Close notifications when opening user menu
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false; // Close user menu when opening notifications
    if (this.showNotifications && this.unreadCount > 0) {
      // Mark all as read when opening notifications panel
      setTimeout(() => {
        this.notificationService.markAllAsRead();
      }, 1000);
    }
  }

  clearNotification(event: Event, notificationId: string) {
    event.stopPropagation();
    this.notificationService.clearNotification(notificationId);
  }

  clearAllNotifications() {
    this.notificationService.clearAll();
  }

  logout() {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  private updateDateTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    this.currentDateTime = now.toLocaleString('en-US', options);
  }
}
