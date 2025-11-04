import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface SearchResult {
  type: 'template' | 'workflow';
  id: string;
  name: string;
  objective?: string;
  status?: string;
  stages?: number;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
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

  // Search functionality
  searchQuery: string = '';
  showSearchResults: boolean = false;
  searchResults: SearchResult[] = [];
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private templates: Template[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private templateService: TemplateService
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

    // Load templates and workflows
    this.loadSearchData();

    // Setup search with debounce
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false; // Close notifications when opening user menu
    this.showSearchResults = false; // Close search when opening user menu
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false; // Close user menu when opening notifications
    this.showSearchResults = false; // Close search when opening notifications
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

  // Search functionality methods
  loadSearchData() {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates.filter(t => t.status === 'ACTIVE' || t.status === 'DRAFT');
        console.log('Loaded templates for search:', this.templates);
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.templates = [];
      }
    });
  }

  onSearchInput(query: string) {
    this.searchQuery = query;
    this.showNotifications = false; // Close notifications
    this.showUserMenu = false; // Close user menu

    if (query.trim().length > 0) {
      this.isSearching = true;
      this.showSearchResults = true;
      this.searchSubject.next(query);
    } else {
      this.showSearchResults = false;
      this.searchResults = [];
      this.isSearching = false;
    }
  }

  performSearch(query: string) {
    const lowerQuery = query.toLowerCase().trim();
    this.searchResults = [];

    // Search templates - only include those with valid IDs
    const matchingTemplates = this.templates.filter(template =>
      template.id && // Must have a valid ID
      (template.name.toLowerCase().includes(lowerQuery) ||
       template.objective.toLowerCase().includes(lowerQuery))
    );

    matchingTemplates.forEach(template => {
      this.searchResults.push({
        type: 'template',
        id: String(template.id), // Ensure ID is a string
        name: template.name,
        objective: template.objective,
        status: template.status,
        stages: template.stages.length
      });
    });

    console.log('Search results:', this.searchResults);
    this.isSearching = false;
  }

  selectSearchResult(result: SearchResult, event?: Event) {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    console.log('Search result clicked:', result);
    console.log('Result type:', result.type);
    console.log('Result ID:', result.id);

    if (result.type === 'template') {
      // Validate ID before navigating
      if (!result.id || result.id.trim() === '') {
        console.error('Invalid template ID:', result.id);
        this.notificationService.showError('Error: Invalid template ID');
        return;
      }

      // Close search dropdown and clear query
      this.showSearchResults = false;
      this.searchQuery = '';

      // Small delay to ensure dropdown closes before navigation
      setTimeout(() => {
        console.log('Attempting navigation to /test-runner/' + result.id);
        this.router.navigate(['/test-runner', result.id])
          .then(success => {
            console.log('Navigation success:', success);
            if (!success) {
              this.notificationService.showError('Navigation failed. Please try again.');
            }
          })
          .catch(error => {
            console.error('Navigation error:', error);
            this.notificationService.showError('Error navigating to template: ' + error.message);
          });
      }, 100);
    }
  }

  closeSearch() {
    this.showSearchResults = false;
  }
}
