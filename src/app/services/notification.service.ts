import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationIdCounter = 0;

  constructor(private snackBar: MatSnackBar) {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return new BehaviorSubject(
      this.notifications$.value.filter(n => !n.read).length
    ).asObservable();
  }

  private addNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const notification: Notification = {
      id: `notif-${++this.notificationIdCounter}`,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([notification, ...currentNotifications]);
  }

  showSuccess(message: string, duration: number = 3000): void {
    this.addNotification(message, 'success');
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.addNotification(message, 'error');
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.addNotification(message, 'info');
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.addNotification(message, 'warning');
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['warning-snackbar']
    });
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notifications$.value.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifications$.next(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notifications$.value.map(n => ({ ...n, read: true }));
    this.notifications$.next(notifications);
  }

  clearNotification(notificationId: string): void {
    const notifications = this.notifications$.value.filter(n => n.id !== notificationId);
    this.notifications$.next(notifications);
  }

  clearAll(): void {
    this.notifications$.next([]);
  }
}
